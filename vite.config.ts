import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { dirname, resolve } from 'node:path'
import { fileURLToPath } from 'node:url'
import githubPages from './vite-plugins/githubPages'
import add404Html from './vite-plugins/add404Html'

const developmentPort = 3000
const previewPort = 4000

const rootDir = dirname(fileURLToPath(import.meta.url))
const srcDir = resolve(rootDir, './src')
const distDir = resolve(rootDir, './dist')
const publicDir = resolve(srcDir, './public')

// https://vitejs.dev/config/
export default defineConfig({
  root: srcDir,
  publicDir: publicDir,
  envDir: rootDir,
  envPrefix: 'PUBLIC_',
  server: {
    host: true,
    port: developmentPort,
    strictPort: true,
  },
  preview: {
    port: previewPort,
    strictPort: true,
  },
  build: {
    outDir: distDir,
    emptyOutDir: true,
  },
  plugins: [react(), githubPages(), add404Html()],
})
