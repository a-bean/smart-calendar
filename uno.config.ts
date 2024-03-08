import { defineConfig, presetUno, presetIcons, transformerDirectives } from 'unocss';

export default defineConfig({
  presets: [presetUno(), presetIcons()],
  transformers: [transformerDirectives()],
  rules: [
    ['task-default-opacity', { opacity: 0.7 }],
    ['task-active-opacity', { opacity: 0.8 }],
  ],
  shortcuts: {
    'is-today': 'inline-block h6 w6 border-rd-50% line-height-6 color-#fff bg-red text-center',
  },
  theme: {
    colors: {
      gray: '#f2f2f2',
    },
  },
});
