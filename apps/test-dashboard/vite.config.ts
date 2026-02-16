import { defineConfig } from 'vite';
import preact from '@preact/preset-vite';
import tailwindcss from '@tailwindcss/vite';
import path from 'path';

export default defineConfig({
  plugins: [
    preact({
      include: [/\.test-dashboard\/src\/.*\.tsx?$/], // Przetwarzaj tylko pliki dashboardu
    }),
    tailwindcss(),
  ],
  resolve: {
    alias: {
      '@shared/ui': path.resolve(__dirname, '../../packages/ui/src'),
      '@shared/logic': path.resolve(__dirname, '../../packages/logic/src'),
      '@shared/locales': path.resolve(__dirname, '../../packages/locales/src'),
      '@shared/types': path.resolve(__dirname, '../../packages/types/src'),
      '@': path.resolve(__dirname, './src'),
    },
  },
  server: {
    port: 3001
  }
});