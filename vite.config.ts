import path from 'path';
import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig(({ mode }) => {
    const env = loadEnv(mode, '.', '');
    const repository = process.env.GITHUB_REPOSITORY?.split('/')[1] ?? '';
    const isUserPage = repository.toLowerCase().endsWith('.github.io');
    const githubPagesBase = process.env.GITHUB_ACTIONS
      ? (isUserPage ? '/' : `/${repository}/`)
      : '/';
    const base = process.env.VITE_BASE_PATH || githubPagesBase;

    return {
      base,
      server: {
        port: 3000,
        host: '0.0.0.0',
      },
      plugins: [react()],
      define: {
        'process.env.API_KEY': JSON.stringify(env.GEMINI_API_KEY),
        'process.env.GEMINI_API_KEY': JSON.stringify(env.GEMINI_API_KEY)
      },
      resolve: {
        alias: {
          '@': path.resolve(__dirname, '.'),
        }
      }
    };
});
