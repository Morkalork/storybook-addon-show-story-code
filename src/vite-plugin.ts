import { extname } from 'path';
import type { Plugin } from 'vite';
import { PARAM_KEY } from './constants';

const STORY_FILE_RE = /\.(stories|story)\.(ts|tsx|js|jsx|mjs|cjs)$/;

function isStoryFile(id: string): boolean {
  return STORY_FILE_RE.test(id.split('?')[0]);
}

function getLanguage(id: string): string {
  const ext = extname(id.split('?')[0]).slice(1).toLowerCase();
  if (ext === 'tsx') return 'tsx';
  if (ext === 'ts') return 'typescript';
  if (ext === 'jsx') return 'jsx';
  return 'javascript';
}

function isTypeScript(id: string): boolean {
  const ext = extname(id.split('?')[0]).slice(1).toLowerCase();
  return ext === 'ts' || ext === 'tsx';
}

// Converts PascalCase/camelCase to the kebab-case Storybook uses in story IDs.
// e.g. "PrimaryButton" → "primary-button"
function toKebab(name: string): string {
  return name
    .replace(/([A-Z])/g, (c, _, i) => (i > 0 ? '-' : '') + c.toLowerCase())
    .toLowerCase();
}

// Extracts each `export const StoryName` block as its own string, keyed by
// the kebab-case name that Storybook uses in story IDs.
function extractStoryExports(code: string): Record<string, string> {
  const map: Record<string, string> = {};
  const re = /^export\s+const\s+(\w+)/gm;
  const matches = [...code.matchAll(re)];
  for (let i = 0; i < matches.length; i++) {
    const name = matches[i][1];
    const start = matches[i].index!;
    const end = i + 1 < matches.length ? matches[i + 1].index! : code.length;
    map[toKebab(name)] = code.slice(start, end).trimEnd();
  }
  return map;
}

function injectSource(code: string, id: string): string {
  if (!/export\s+default\s+/.test(code)) return code;

  const language = getLanguage(id);
  const stories = extractStoryExports(code);
  // Stringify the original source before any modification
  const paramJson = JSON.stringify({ source: code, language, stories });

  // Replace `export default` with a let-assignment so we can spread it
  // and inject our parameters alongside whatever the story author set.
  // The `let` declaration lands before the original imports which is
  // technically non-standard, but Vite/esbuild handles it without issues.
  const body = code.replace(/export\s+default\s+/, '__whole_story_default__ = ');
  // Only add `: any` type annotation for TypeScript files
  const letDecl = isTypeScript(id)
    ? 'let __whole_story_default__: any;'
    : 'let __whole_story_default__;';

  return [
    letDecl,
    body,
    `export default {`,
    `  ...__whole_story_default__,`,
    `  parameters: {`,
    `    ...(__whole_story_default__?.parameters ?? {}),`,
    `    ${PARAM_KEY}: ${paramJson},`,
    `  },`,
    `};`,
  ].join('\n');
}

export function storybookShowStoryCodePlugin(): Plugin {
  return {
    name: 'maffelu/storybook-addon-show-story-code',
    enforce: 'pre',
    transform(code: string, id: string) {
      if (!isStoryFile(id)) return null;
      try {
        return { code: injectSource(code, id), map: null };
      } catch (err) {
        this.warn(`Failed to inject story source for ${id}: ${err}`);
        return null;
      }
    },
  };
}
