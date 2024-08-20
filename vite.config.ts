import path from 'path';
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: [
      {
        find: /^\$(.*)/,
        replacement: path.resolve(__dirname, './src/$1'),
      },
      {
        find: /^\$(.*)/,
        replacement: path.resolve(__dirname, './src/$1/index.ts'),
      },
    ],
  },
  build: {
    lib: {
      entry: path.resolve(__dirname, './src/main.ts'),
      name: 'useAppEvents',
    },
    rollupOptions: {
      external: ['react', 'react-dom'],
      output: {
        globals: {
          react: 'React',
        },
      },
    },
  },
  // TODO: modify build options
  server: { port: 8080, host: true },
});

