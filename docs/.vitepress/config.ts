import { defineConfig } from 'vitepress'
import { generateSidebar, generateNav } from './utils/auto-sidebar'
import path from 'node:path'
import { createContentLoader } from 'vitepress'
import { SitemapStream, streamToPromise } from 'sitemap'
import { createWriteStream } from 'node:fs'
import { resolve } from 'node:path'

export default defineConfig({
  title: '北川Coding',
  description: 'Java 后端开发学习路径 - 从入门到精通',
  
  // SEO 优化：站点地图生成
  buildEnd: async ({ outDir }) => {
    const sitemap = new SitemapStream({ hostname: 'https://beichuan-coding.com/' })
    const pages = await createContentLoader('**/*.md').load()
    const writeStream = createWriteStream(resolve(outDir, 'sitemap.xml'))

    sitemap.pipe(writeStream)
    pages.forEach((page) => sitemap.write(page.url.replace(/index$/g, '')))
    sitemap.end()

    await streamToPromise(sitemap)
  },

  head: [
    ['link', { rel: 'icon', href: '/logo.svg' }],
    // SEO Meta
    ['meta', { name: 'keywords', content: 'Java, Spring Boot, MySQL, Redis, 微服务, 面试题, 架构设计' }],
    ['meta', { name: 'author', content: '北川' }]
  ],

  themeConfig: {
    logo: '/logo.svg',
    
    // 启用大纲
    outline: {
      level: [2, 3], // 显示 h2 和 h3
      label: '本页目录'
    },

    // 启用最后更新时间
    lastUpdated: {
      text: '最后更新于',
      formatOptions: {
        dateStyle: 'short',
        timeStyle: 'medium'
      }
    },

    // 编辑链接
    editLink: {
      pattern: 'https://github.com/yourname/edit/main/docs/:path',
      text: '在 GitHub 上编辑此页'
    },

    // 动态生成 Nav 和 Sidebar
    nav: generateNav(),
    sidebar: generateSidebar(path.resolve(__dirname, '../')),

    socialLinks: [
      { icon: 'github', link: 'https://github.com/yourname' }
    ],

    footer: {
      message: '学无止境，持续更新中... | 基于 VitePress 构建',
      copyright: 'Copyright © 2024 北川Coding 版权所有'
    },

    // 优化搜索配置：支持详细预览和快捷键
    search: {
      provider: 'local',
      options: {
        detailedView: true, // 开启详细视图
        _render(src, env, md) {
          const html = md.render(src, env)
          if (env.frontmatter?.search === false) return ''
          if (env.relativePath.startsWith('docs/')) return '' // 排除不需要的目录
          return html
        },
        translations: {
          button: {
            buttonText: '搜索文档',
            buttonAriaLabel: '搜索文档'
          },
          modal: {
            noResultsText: '无法找到相关结果',
            resetButtonTitle: '清除查询条件',
            footer: {
              selectText: '选择',
              navigateText: '切换',
              closeText: '关闭'
            }
          }
        }
      }
    }
  }
})
