import React, { useCallback, useState } from 'react';
import { useParameter, useStorybookState } from 'storybook/manager-api';
import { AddonPanel } from 'storybook/internal/components';
import { PrismLight as SyntaxHighlighter } from 'react-syntax-highlighter';
// @ts-ignore - individual language imports lack precise types
import tsx from 'react-syntax-highlighter/dist/esm/languages/prism/tsx';
// @ts-ignore
import typescript from 'react-syntax-highlighter/dist/esm/languages/prism/typescript';
// @ts-ignore
import jsx from 'react-syntax-highlighter/dist/esm/languages/prism/jsx';
// @ts-ignore
import javascript from 'react-syntax-highlighter/dist/esm/languages/prism/javascript';
import { vscDarkPlus } from 'react-syntax-highlighter/dist/esm/styles/prism';
import { PARAM_KEY } from './constants';

SyntaxHighlighter.registerLanguage('tsx', tsx);
SyntaxHighlighter.registerLanguage('typescript', typescript);
SyntaxHighlighter.registerLanguage('jsx', jsx);
SyntaxHighlighter.registerLanguage('javascript', javascript);

interface StorySourceParam {
  source: string;
  language: string;
  panelTitle?: string;
  showOnlyStoryCode?: boolean;
  stories?: Record<string, string>;
}

const SETUP_HINT = `// .storybook/main.ts
import { storybookShowStoryCodePlugin } from '@maffelu/storybook-addon-show-story-code/vite-plugin';

export default {
  addons: ['@maffelu/storybook-addon-show-story-code'],
  viteFinal: (config) => ({
    ...config,
    plugins: [...(config.plugins ?? []), storybookShowStoryCodePlugin()],
  }),
};`;

const styles = {
  root: {
    height: '100%',
    overflow: 'hidden',
    position: 'relative' as const,
    background: '#1e1e1e',
  },
  scroll: {
    height: '100%',
    overflow: 'auto',
  },
  copyBtn: (copied: boolean): React.CSSProperties => ({
    position: 'absolute',
    top: '10px',
    right: '16px',
    zIndex: 10,
    padding: '4px 12px',
    background: copied ? '#2e7d32' : '#3a3a3a',
    color: '#e0e0e0',
    border: '1px solid #555',
    borderRadius: '4px',
    cursor: 'pointer',
    fontSize: '12px',
    fontFamily: 'sans-serif',
    transition: 'background 0.2s',
  }),
  empty: {
    padding: '24px',
    fontFamily: 'sans-serif',
    color: '#aaa',
  },
  hint: {
    marginTop: '16px',
    background: '#1e1e1e',
    color: '#d4d4d4',
    padding: '16px',
    borderRadius: '6px',
    fontSize: '13px',
    lineHeight: '1.6',
    overflowX: 'auto' as const,
  },
};

function PanelContent() {
  const param = useParameter<StorySourceParam | undefined>(PARAM_KEY, undefined);
  const { storyId } = useStorybookState();
  const [copied, setCopied] = useState(false);

  const storyKey = storyId ? storyId.replace(/^.*--/, '') : '';
  const displaySource =
    param?.showOnlyStoryCode && storyKey && param.stories?.[storyKey]
      ? param.stories[storyKey]
      : param?.source;

  const handleCopy = useCallback(() => {
    if (!displaySource) return;
    navigator.clipboard.writeText(displaySource).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  }, [displaySource]);

  if (!displaySource) {
    return (
      <div style={styles.empty}>
        <p style={{ margin: 0 }}>
          No source available. Make sure the Vite plugin is configured:
        </p>
        <pre style={styles.hint}>{SETUP_HINT}</pre>
      </div>
    );
  }

  return (
    <div style={styles.root}>
      <button style={styles.copyBtn(copied)} onClick={handleCopy}>
        {copied ? 'Copied!' : 'Copy'}
      </button>
      <div style={styles.scroll}>
        <SyntaxHighlighter
          language={param.language}
          style={vscDarkPlus}
          showLineNumbers
          customStyle={{ margin: 0, minHeight: '100%', background: '#1e1e1e', fontSize: '13px' }}
          codeTagProps={{ style: { fontFamily: "'Fira Code', 'Cascadia Code', Consolas, monospace" } }}
        >
          {displaySource}
        </SyntaxHighlighter>
      </div>
    </div>
  );
}

export function Panel({ active }: { active: boolean }) {
  return (
    <AddonPanel active={active}>
      <PanelContent />
    </AddonPanel>
  );
}
