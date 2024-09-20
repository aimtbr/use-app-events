import path from 'path';
// import { rename } from 'fs/promises';
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import dts from 'vite-plugin-dts';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    react({
      babel: {
        configFile: './babel.config.cjs',
      },
    }),
    dts({
      tsconfigPath: path.resolve(__dirname, './tsconfig.app.json'),
      include: ['src'],
      exclude: ['src/__tests__', 'src/examples', 'src/vite-env.d.ts'],
    }),
  ],
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
      fileName: '[name]',
      formats: ['es'],
    },

    rollupOptions: {
      external: ['react', 'react-dom'],
      output: {
        inlineDynamicImports: false,
        preserveModules: true,
      },
    },
  },
  server: { port: 8080, host: true },
});

