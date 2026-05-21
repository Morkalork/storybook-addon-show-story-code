import path from 'path';
import { storybookShowStoryCodePlugin } from './vite-plugin';

// Array format required by Storybook 10+. __dirname is injected by tsup
// (shims: true) for ESM builds; natively available in CJS builds.
export const managerEntries = [path.join(__dirname, 'manager.js')];

export async function viteFinal(config: Record<string, unknown>): Promise<Record<string, unknown>> {
  const existingPlugins = (config.plugins as unknown[] | undefined) ?? [];
  return {
    ...config,
    plugins: [...existingPlugins, storybookShowStoryCodePlugin()],
  };
}
