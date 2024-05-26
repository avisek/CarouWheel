/**
 * Duplicate index.html as 404.html for better static routing
 */

import type { PluginOption, ResolvedBuildOptions } from 'vite'
import { dirname, join } from 'path'
import { copyFileSync, existsSync } from 'fs'

export default function add404Html(): PluginOption {
  let buildConfig: ResolvedBuildOptions
  
  return {
    name: 'vite-plugin-add-404-html',
    apply: 'build',
    
    configResolved({ build }) {
      buildConfig = build
    },
    
    closeBundle() {
      if (buildConfig.ssr) return
      
      const indexHtml = join(buildConfig.outDir, 'index.html')
      if (!existsSync(indexHtml)) return
      
      const dir = dirname(indexHtml)
      copyFileSync(indexHtml, join(dir, '404.html'))
    },
  }
}
