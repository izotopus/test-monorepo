// @ts-check
import { defineConfig } from 'astro/config';
import alpinejs from '@astrojs/alpinejs';
import lit from '@astrojs/lit';
import tailwindcss from '@tailwindcss/vite';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const BASE_URL = process.env.BASE_URL || '/';

export default defineConfig({
  base: BASE_URL,
  integrations: [alpinejs(), lit()],
  vite: {
    plugins: [
      tailwindcss(),
      {
        name: 'watch-external-packages',
        configureServer(server) {
          server.watcher.add(path.resolve(__dirname, '../../packages/ui/src'));
          server.watcher.add(path.resolve(__dirname, '../../packages/logic/src'));
          server.watcher.add(path.resolve(__dirname, '../../packages/types/src'));
        }
      }
    ],
    ssr: {
      noExternal: ['@shared/ui', '@shared/logic', '@shared/types', 'lit', '@lit/reactive-element']
    },
    resolve: {
      alias: {
        '@shared/types': path.resolve(__dirname, '../../packages/types/src'),
        '@shared/ui': path.resolve(__dirname, '../../packages/ui/src'),
        '@shared/logic': path.resolve(__dirname, '../../packages/logic/src'),

        '@shared/logic/signals': path.resolve(__dirname, '../../packages/logic/src/signals/index.ts'),
        '@shared/logic/utils': path.resolve(__dirname, '../../packages/logic/src/utils/index.ts'),

        '@portal': path.resolve(__dirname, './src'),
        '@assets': path.resolve(__dirname, './src/assets'),
        '@scripts': path.resolve(__dirname, './src/scripts'),
        '@styles': path.resolve(__dirname, './src/styles'),
        '@components': path.resolve(__dirname, './src/components'),
        '@layouts': path.resolve(__dirname, './src/layouts'),
        '@pages': path.resolve(__dirname, './src/pages'),
        '@content': path.resolve(__dirname, './src/content'),
      }
    }
  }
});