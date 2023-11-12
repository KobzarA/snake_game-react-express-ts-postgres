import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react-swc';
/** @type {import('vite').UserConfig} */

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  build: {
    sourcemap: true,
    outDir: '../server/public',
  },
});
