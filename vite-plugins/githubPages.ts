/**
 * Automagically prepend repo wise `base` path when deploying to GitHub Pages
 */

import type { PluginOption } from 'vite'

export default function githubPages(): PluginOption {
  return {
    name: 'vite-plugin-github-pages',
    enforce: 'post',
    apply: 'build',
    config(config) {
      if (process.env['GITHUB_ACTIONS'] !== 'true') return
      const [userName, repoName] = process.env['GITHUB_REPOSITORY'].split('/')
      if (repoName === `${userName}.github.io`) return
      config.base = `/${repoName}${config.base ?? '/'}`
    },
  }
}
