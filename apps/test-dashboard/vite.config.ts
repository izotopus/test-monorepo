import { defineConfig } from 'vite';
import preact from '@preact/preset-vite';
import tailwindcss from '@tailwindcss/vite';
import { resolve } from 'path';

export default defineConfig({
  base: process.env.BASE_URL || '/',
  plugins: [
    preact({
      include: [/\.test-dashboard\/src\/.*\.tsx?$/],
    }),
    tailwindcss(),
  ],
  resolve: {
    alias: {
      '@': resolve(__dirname, './src'),
      '@hooks': resolve(__dirname, './src/hooks'),
      '@components': resolve(__dirname, './src/components'),
      '@adapters': resolve(__dirname, './src/adapters'),
      
      '@shared/ui': resolve(__dirname, '../../packages/ui/src'),
      '@shared/logic': resolve(__dirname, '../../packages/logic/src'),
      '@shared/locales': resolve(__dirname, '../../packages/locales/src'),
      '@shared/types': resolve(__dirname, '../../packages/types/src'),
    },
  },
  server: {
    port: 3001
  }
});