import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { resolve } from 'node:path'

export default defineConfig({
  plugins: [react()],
  build: {
    rollupOptions: {
      input: {
        olfacta: resolve(__dirname, 'olfacta.html'),
        shiftnomad: resolve(__dirname, 'shiftnomad.html'),
        sporespot: resolve(__dirname, 'sporespot.html'),
      },
    },
  },
})
