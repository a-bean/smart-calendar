import { defineConfig } from 'vite';
import vue from '@vitejs/plugin-vue';
import path from 'path';
import UnoCSS from 'unocss/vite';

// https://vitejs.dev/config/
export default defineConfig(() => {
  return {
    base: '/',
    root: 'example/',
    plugins: [vue(), UnoCSS()],
    resolve: {
      alias: {
        '@': path.resolve(__dirname, 'src'),
      },
      extensions: ['.js', '.vue', '.json', '.ts'],
    },

    server: {
      host: true,
      open: true,
    },
  };
});
