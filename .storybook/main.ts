import type { StorybookConfig } from '@storybook/react-vite';
import { fileURLToPath } from 'url';
import { dirname, resolve } from 'path';

const __dirname = dirname(fileURLToPath(import.meta.url));

const config: StorybookConfig = {
  stories: ['../demo/**/*.stories.@(ts|tsx)'],
  addons: [
    // Load our addon directly from the built dist so this demo exercises
    // the real package output rather than raw source.
    resolve(__dirname, '../dist/preset.cjs'),
  ],
  framework: {
    name: '@storybook/react-vite',
    options: {},
  },
};

export default config;
