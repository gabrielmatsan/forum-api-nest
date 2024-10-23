import swc from 'unplugin-swc'
import { defineConfig } from 'vitest/config'
import tsconfigPaths from 'vite-tsconfig-paths' // Corrigir importação

export default defineConfig({
  test: {
    include: ['**/*.e2e-spec.ts'],
    globals: true,
    root: './',
    setupFiles: ['./test/setup-e2e.ts'],
  },
  plugins: [
    // Configurar para carregar os paths do tsconfig
    tsconfigPaths(),
    swc.vite({
      // Definir explicitamente o tipo de módulo
      module: { type: 'es6' },
    }),
  ],
})
