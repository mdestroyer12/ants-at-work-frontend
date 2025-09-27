import { defineConfig } from 'vite'
import tailwindcss from '@tailwindcss/vite'
import react from '@vitejs/plugin-react'
import { resolve } from 'path';

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), tailwindcss()],
  resolve: {
    alias: {
      'src': resolve(__dirname, 'src'),
      '@components': resolve(__dirname, 'src/components'),
      '@schemas': resolve(__dirname, 'src/schemas'),
    },
  },
})
