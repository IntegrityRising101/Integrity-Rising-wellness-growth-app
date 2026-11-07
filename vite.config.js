import react from '@vitejs/plugin-react'
import { defineConfig } from 'vite'

// GitHub Pages serves this project from its repository subpath.
export default defineConfig({
  base: '/Integrity-Rising-wellness-growth-app/',
  plugins: [react()],
})

l
