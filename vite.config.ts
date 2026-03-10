import { defineConfig, loadEnv } from 'vite';
import tailwindcss from '@tailwindcss/vite';
import react from '@vitejs/plugin-react';
import federation from '@originjs/vite-plugin-federation';
import wasm from "vite-plugin-wasm";
import topLevelAwait from "vite-plugin-top-level-await";

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '');  
  const port = Number(env.SERVER_PORT) || 3001;

  return {
    plugins: [
      react(),
      tailwindcss(),
      wasm(),
      topLevelAwait(),
      federation({
        name: 'mfe_template',
        filename: 'remoteEntry.js',
        exposes: {
          './Widget': './src/Widget.tsx',
        },
        shared: ['react', 'react-dom'],
      }),
    ],
    server: {
      port: port,
      strictPort: true,
      cors: true
    },
    build: {
      target: 'esnext',
      minify: false,
      cssCodeSplit: true
    },
    preview: {
      port: port,
      strictPort: true,
    },
  };
});