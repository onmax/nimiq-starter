// @ts-check
import antfu from '@antfu/eslint-config'

export default antfu(
  {
    vue: true,
    ignores: [
      '.claude/**/*.md',
      'CLAUDE.md',
      'AGENTS.md',
      '**/public/worker-wasm/**',
    ],
  },
  {
    files: ['**/tests/**/*', '**/*.test.*', '**/*.spec.*'],
    rules: {
      'no-console': 'off',
    },
  },
)
