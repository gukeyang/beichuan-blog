import { defineConfig } from 'vitepress'

// https://vitepress.dev/reference/site-config
export default defineConfig({
  title: "尘川的知识库",
  description: "小谷的个人知识库 - 学习笔记、灵感想法、项目记录",
  lastUpdated: true,

  // 启用文章目录（右侧 TOC）
  markdown: {
    theme: {
      light: 'vitesse-light',
      dark: 'vitesse-dark'
    },
    image: {
      lazyLoading: true
    }
  },

  themeConfig: {
    // 启用面包屑导航
    outline: { level: [2, 3], label: '目录' },
    
    // 启用上一篇/下一篇
    docFooter: {
      prev: '上一篇',
      next: '下一篇'
    },
    
    // 启用面包屑
    breadcrumb: {
      label: '面包屑导航'
    },
    
    // 侧边栏可折叠
    sidebar: {
      useLink: true,
      filtered: true
    },
    // https://vitepress.dev/reference/default-theme-config
    nav: [
      { text: '🏠 首页', link: '/' },
      { text: '📚 学习笔记', link: '/notes/' },
      { text: '💡 灵感想法', link: '/ideas/' },
      { text: '🛠️ 项目记录', link: '/projects/' },
      { text: '📖 读书笔记', link: '/books/' }
    ],

    sidebar: {
      '/notes/': [
        {
          text: '📚 学习笔记',
          items: [
            { text: '概览', link: '/notes/' },
            { text: '☕ Java 后端', link: '/notes/java/' },
            {
              text: '🤖 AI/机器学习',
              items: [
                { text: '概览', link: '/notes/ai/' },
                { text: '🐕 OpenClaw 完全指南', link: '/notes/ai/openclaw-tutorial' },
                { text: 'OpenClaw 集成实践', link: '/notes/ai/openclaw-integration' },
              ]
            },
            { text: '🎨 前端开发', link: '/notes/frontend/' },
            { text: '🗄️ 数据库', link: '/notes/database/' },
            { text: '🚀 DevOps', link: '/notes/devops/' },
          ]
        }
      ],
      '/ideas/': [
        {
          text: '💡 灵感想法',
          items: [
            { text: '概览', link: '/ideas/' },
            { text: '🚀 产品想法', link: '/ideas/products/' },
            { text: '🔬 技术探索', link: '/ideas/tech/' },
            { text: '🌸 生活感悟', link: '/ideas/life/' },
          ]
        }
      ],
      '/projects/': [
        {
          text: '🛠️ 项目记录',
          items: [
            { text: '概览', link: '/projects/' },
            { text: '🤖 抖尘 AI 中台', link: '/projects/ai-platform/' },
            { text: '📊 CRM 系统', link: '/projects/crm/' },
            { text: '🎮 个人项目', link: '/projects/personal/' },
          ]
        }
      ],
      '/books/': [
        {
          text: '📖 读书笔记',
          items: [
            { text: '概览', link: '/books/' },
            { text: '💻 技术书籍', link: '/books/tech/' },
            { text: '📚 非技术书籍', link: '/books/non-tech/' },
          ]
        }
      ],
    },

    socialLinks: [
      { icon: 'github', link: 'https://github.com/donkeyyz/beichuan-blog' }
    ],

    footer: {
      message: 'Made with ❤️ by 小谷',
      copyright: 'Copyright © 2024 尘川'
    }
  },
  
  // 忽略死链检查
  ignoreDeadLinks: true
})
