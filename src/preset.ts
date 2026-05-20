import path from 'path';
import { storybookShowStoryCodePlugin } from './vite-plugin';

// __dirname is injected by tsup (shims: true) for ESM builds;
// it is naturally available in CJS builds.

export const managerEntries = (entries: string[] = []): string[] => [
  ...entries,
  path.join(__dirname, 'manager.js'),
];

export const previewAnnotations = (entries: string[] = []): string[] => [
  ...entries,
  path.join(__dirname, 'preview.js'),
];

export async function viteFinal(config: Record<string, unknown>): Promise<Record<string, unknown>> {
  const existingPlugins = (config.plugins as unknown[] | undefined) ?? [];
  return {
    ...config,
    plugins: [...existingPlugins, storybookShowStoryCodePlugin()],
  };
}
