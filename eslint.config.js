// @ts-check
import antfu from '@antfu/eslint-config'

export default antfu(
  {
    vue: true,
    ignores: [
      '.claude/**/*.md',
      'CLAUDE.md',
    ],
  },
  {
    files: ['**/tests/**/*', '**/*.test.*', '**/*.spec.*'],
    rules: {
      'no-console': 'off',
    },
  },
)
