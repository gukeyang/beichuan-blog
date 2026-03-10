import { defineConfig } from 'vitepress'
import { generateSidebar, generateNav } from './utils/auto-sidebar'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

const __dirname = path.dirname(fileURLToPath(import.meta.url))

export default defineConfig({
  title: '北川博客',
  description: '后端开发技术博客 - Java、数据库、中间件、系统架构',
  ignoreDeadLinks: true,
  themeConfig: {
    nav: [
      ...generateNav(),
      { text: '🌤️ 天气', link: '/weather.html' }
    ],
    sidebar: generateSidebar(path.resolve(__dirname, '../')),
    socialLinks: [
      { icon: 'github', link: 'https://github.com/gukeyang/beichuan-blog' }
    ],
    footer: {
      message: 'Released under the MIT License.',
      copyright: 'Copyright © 2024-present 北川博客'
    },
    search: {
      provider: 'local',
      options: {
        locales: {
          root: {
            translations: {
              button: { buttonText: '搜索文档', buttonAriaLabel: '搜索文档' },
              modal: {
                noResultsText: '无法找到相关结果',
                resetButtonTitle: '清除查询条件',
                footer: { selectText: '选择', navigateText: '切换' }
              }
            }
          }
        }
      }
    },
    outline: { level: 'deep', label: '目录' },
    editLink: {
      pattern: 'https://github.com/gukeyang/beichuan-blog/edit/main/docs/:path',
      text: '在 GitHub 上编辑此页面'
    },
    docFooter: { prev: '上一页', next: '下一页' }
  },
  markdown: {
    theme: { light: 'vitesse-light', dark: 'vitesse-dark' },
    lineNumbers: true
  },
  head: [
    ['link', { rel: 'icon', href: '/favicon.ico' }],
    ['meta', { name: 'viewport', content: 'width=device-width, initial-scale=1.0' }]
  ]
})
