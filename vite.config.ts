import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'path'
import dst from 'vite-plugin-dts'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), dst({ tsconfigPath: './tsconfig.app.json' })],
  build: {
    lib: {
      entry: path.resolve(__dirname, 'src/index.tsx'),
      name: 'react-player-cc',
      fileName: (format) => `index.${format}.js`
    },
    emptyOutDir: true,
    rollupOptions: {
      external: ['react', 'react-dom'],
      output: {
        globals: {
          react: 'React',
          'react-dom': 'ReactDOM'
        }
      }
    }
  }
})
