// uno.config.ts
import { defineConfig, presetUno, presetIcons, transformerDirectives } from 'unocss';

export default defineConfig({
  // ...UnoCSS选项
  presets: [presetUno(), presetIcons()],
  transformers: [transformerDirectives()],
  theme: {
    colors: {
      gray: '#f2f2f2',
    },
  },
});
