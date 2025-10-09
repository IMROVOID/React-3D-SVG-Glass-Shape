import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  // Set the base to the repository name so the built assets load correctly
  // when served from GitHub Pages at https://<user>.github.io/<repo>/
  base: '/React-3D-SVG-Glass-Shape/',
  plugins: [react()],
})
