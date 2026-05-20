import { defineConfig } from 'tsup';

export default defineConfig({
  entry: {
    preset: 'src/preset.ts',
    manager: 'src/manager.tsx',
    preview: 'src/preview.ts',
    'vite-plugin': 'src/vite-plugin.ts',
  },
  format: ['esm', 'cjs'],
  dts: true,
  shims: true,
  splitting: false,
  sourcemap: true,
  clean: true,
  external: [
    'react',
    'react-dom',
    'storybook',
    /^storybook\//,
    /^@storybook\//,
    'vite',
  ],
});
