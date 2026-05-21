import { defineConfig } from 'tsup';

const sharedExternal = [
  'react',
  'react-dom',
  /^react\//,
  /^react-dom\//,
  'storybook',
  /^storybook\//,
  /^@storybook\//,
  'vite',
] as const;

export default defineConfig([
  // Node.js entries — preset and vite-plugin run in Node and legitimately
  // need __dirname shims for resolving sibling dist files.
  {
    entry: {
      preset: 'src/preset.ts',
      preview: 'src/preview.ts',
      'vite-plugin': 'src/vite-plugin.ts',
    },
    format: ['esm', 'cjs'],
    dts: true,
    shims: true,
    splitting: false,
    sourcemap: true,
    clean: true,
    external: [...sharedExternal],
  },
  // Browser entry — manager runs in Storybook's browser context. No Node
  // shims allowed; react-syntax-highlighter is bundled so it needs no
  // runtime resolution.
  {
    entry: { manager: 'src/manager.tsx' },
    format: ['esm', 'cjs'],
    dts: true,
    shims: false,
    splitting: false,
    sourcemap: true,
    clean: false,
    platform: 'browser',
    external: [...sharedExternal],
    noExternal: ['react-syntax-highlighter'],
  },
]);
