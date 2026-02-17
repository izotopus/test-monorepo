import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import tailwindcss from '@tailwindcss/vite';
import path, { resolve } from 'path';

export default defineConfig({
  base: process.env.BASE_URL || '/',
  plugins: [react(), tailwindcss()],
  resolve: {
    alias: {
      '@shared/ui': path.resolve(__dirname, '../../packages/ui/src'),
      '@shared/logic': path.resolve(__dirname, '../../packages/logic/src'),
      '@shared/locales': path.resolve(__dirname, '../../packages/locales/src'),
      '@shared/types': path.resolve(__dirname, '../../packages/types/src'),
      '@': path.resolve(__dirname, './src'),
    },
  },
  define: {
    'process.env.NODE_ENV': JSON.stringify('production'),
  },
  build: {
    lib: {
      entry: resolve(__dirname, 'src/main.tsx'),
      name: 'TaskManager',
      formats: ['es'],
      fileName: () => 'main.js'
    },
    rollupOptions: {
      external: [], 
    }
  },
  server: {
    port: 3002,
    cors: true,
  }
});