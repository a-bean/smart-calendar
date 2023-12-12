module.exports = {
  root: true,
  env: {
    browser: true,
    es2021: true,
  },
  settings: {
    'import/resolver': {
      typescript: {},
    },
  },
  globals: {
    // 不需要在全局引入,vue 编译期间自动注入
    defineProps: 'readonly',
    defineEmits: 'readonly',
    defineExpose: 'readonly',
  },
  plugins: ['@typescript-eslint', 'prettier', 'html'],
  parser: 'vue-eslint-parser',
  parserOptions: {
    parser: '@typescript-eslint/parser',
    ecmaFeatures: {
      // 防止vue里写tsx eslint 报错
      jsx: true,
    },
  },
  extends: [
    'plugin:vue/vue3-recommended',
    'airbnb-base',
    'plugin:prettier/recommended',
    'eslint:recommended',
    'plugin:@typescript-eslint/recommended',
  ],
  rules: {
    'no-plusplus': 'off',
    'import/prefer-default-export': 'off',
    // 代码风格问题不警告, 在pre-commit时候做统一格式化
    'prettier/prettier': 'off',
    'no-console': process.env.NODE_ENV === 'production' ? 'warn' : 'off',
    'no-debugger': process.env.NODE_ENV === 'production' ? 'warn' : 'off',
    // 以下两行解决enum eslint校验问题
    'no-shadow': 'off',
    '@typescript-eslint/no-shadow': 'error',

    'no-restricted-syntax': 'off',
    'no-param-reassign': 'off',
    'no-continue': 'off',
    'no-await-in-loop': 'off',
    '@typescript-eslint/no-non-null-assertion': 'off',
    '@typescript-eslint/no-explicit-any': 'error',
    '@typescript-eslint/no-empty-function': 'off',

    'vue/multi-word-component-names': 'off',
    'vue/no-v-html': 'off',
    'import/no-extraneous-dependencies': ['error', { devDependencies: ['**/*.ts', '**/*.js'] }],
    // eslint 自动组织 import 顺序关闭
    'import/order': 'off',
    // 自动引入报未找到 api，ts会做校验，eslint 就不需要了
    'no-undef': 'off',
    'import/no-unresolved': 'off',
    'import/extensions': [
      'error',
      'always',
      {
        js: 'never',
        jsx: 'never',
        tsx: 'never',
        vue: 'never',
        ts: 'never',
      },
    ],
  },
};
