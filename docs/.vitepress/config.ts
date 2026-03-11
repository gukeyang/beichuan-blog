import { defineConfig } from 'vitepress'

// https://vitepress.dev/reference/site-config
export default defineConfig({
  title: "北川的知识库",
  description: "北川的个人知识库 - 学习笔记、灵感想法、项目记录",
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
    // 启用搜索功能
    search: {
      provider: 'local',
      options: {
        locales: {
          root: {
            translations: {
              button: {
                buttonText: '搜索',
                buttonAriaLabel: '搜索文档'
              },
              modal: {
                noResultsText: '无法找到相关结果',
                resetButtonTitle: '清除查询条件',
                footer: {
                  selectText: '选择',
                  navigateText: '切换'
                }
              }
            }
          }
        }
      }
    },
    
    // 启用面包屑导航
    outline: { level: [2, 3], label: '目录' },
    
    // 启用上一篇/下一篇
    docFooter: {
      prev: '上一篇',
      next: '下一篇'
    },
    
    // 顶部导航
    nav: [
      { text: '🏠 首页', link: '/' },
      { text: '📚 学习笔记', link: '/notes/' },
      { text: '💡 灵感想法', link: '/ideas/' },
      { text: '🛠️ 项目记录', link: '/projects/' },
      { text: '📖 读书笔记', link: '/books/' }
    ],

    // 侧边栏配置 - 支持多级折叠展开
    sidebar: {
      // 学习笔记侧边栏
      '/notes/': [
        {
          text: '📚 学习笔记',
          link: '/notes/',
          collapsed: false,
          items: [
            {
              text: '☕ Java 后端',
              link: '/notes/java/',
              collapsed: true,
              items: [
                { text: '📄 概览', link: '/notes/java/' },
                { text: '语法基础', link: '/java/syntax' },
                { text: '面向对象', link: '/java/oop' },
                { text: '异常处理', link: '/java/exception' },
                { text: '集合框架', link: '/java/collection' },
                { text: '并发编程', link: '/java/concurrency-basics' },
                { text: '并发工具类', link: '/java/concurrent' },
                { text: '新特性', link: '/java/new-features' }
              ]
            },
            {
              text: '🌸 Spring 全家桶',
              link: '/notes/spring/',
              collapsed: true,
              items: [
                { text: '📄 概览', link: '/notes/spring/' },
                { text: 'Spring Framework', link: '/spring/framework' },
                { text: 'Spring Boot', link: '/spring/boot' },
                { text: 'Spring Cloud', link: '/spring/cloud' },
                { text: '架构设计', link: '/spring/architecture' },
                { text: '自动配置原理', link: '/spring/spring-boot-autoconfig' }
              ]
            },
            {
              text: '🤖 AI/机器学习',
              link: '/notes/ai/',
              collapsed: false,
              items: [
                { text: '📄 概览', link: '/notes/ai/' },
                { text: 'LLM 基础', link: '/ai/llm-basics' },
                { text: 'Prompt Engineering', link: '/ai/prompt-engineering' },
                { text: 'RAG 实现', link: '/ai/rag-implementation' },
                { text: '本地模型部署', link: '/ai/local-model-deployment' },
                { text: 'Agent 开发', link: '/ai/agent-development' },
                { text: '🐕 OpenClaw 完全指南', link: '/notes/ai/openclaw-tutorial' },
                { text: '🔧 OpenClaw 集成实践', link: '/notes/ai/openclaw-integration' }
              ]
            },
            {
              text: '🗄️ 数据库',
              link: '/notes/database/',
              collapsed: true,
              items: [
                { text: '📄 概览', link: '/notes/database/' },
                { text: 'MySQL 索引', link: '/database/mysql-index' },
                { text: 'MySQL 索引优化', link: '/database/mysql-index-optimization' },
                { text: 'NoSQL', link: '/database/nosql' },
                { text: 'ORM', link: '/database/orm' }
              ]
            },
            {
              text: '🎨 前端开发',
              link: '/notes/frontend/',
              collapsed: true,
              items: [
                { text: '📄 概览', link: '/notes/frontend/' },
                { text: 'HTTP 协议', link: '/web/http' },
                { text: 'HTTP vs HTTPS', link: '/network/http-vs-https' },
                { text: 'Servlet', link: '/web/servlet' }
              ]
            },
            {
              text: '🚀 DevOps',
              link: '/notes/devops/',
              collapsed: true,
              items: [
                { text: '📄 概览', link: '/notes/devops/' },
                { text: 'Git 使用指南', link: '/engineering/git' },
                { text: 'CI/CD', link: '/engineering/cicd' },
                { text: '分布式一致性', link: '/engineering/distributed-consistency' }
              ]
            },
            {
              text: '📡 中间件',
              link: '/notes/middleware/',
              collapsed: true,
              items: [
                { text: '📄 概览', link: '/notes/middleware/' },
                { text: 'Kafka 核心', link: '/middleware/kafka-core' },
                { text: 'Redis 缓存模式', link: '/middleware/redis-cache-patterns' }
              ]
            },
            {
              text: '🌐 网络协议',
              link: '/notes/network/',
              collapsed: true,
              items: [
                { text: 'TCP 三次握手', link: '/network/tcp-handshake' },
                { text: 'TCP 四次挥手', link: '/network/tcp-four-way-handshake' }
              ]
            },
            {
              text: '💻 操作系统',
              link: '/notes/os/',
              collapsed: true,
              items: [
                { text: '进程与线程', link: '/os/process-thread' },
                { text: '虚拟内存', link: '/os/virtual-memory' }
              ]
            },
            {
              text: '🔢 算法与数据结构',
              link: '/notes/algorithm/',
              collapsed: true,
              items: [
                { text: '📄 概览', link: '/notes/algorithm/' },
                { text: '排序算法', link: '/algorithm/sorting-algorithms' }
              ]
            },
            {
              text: '📐 计算机基础',
              link: '/notes/foundation/',
              collapsed: true,
              items: [
                { text: '📄 概览', link: '/notes/foundation/' },
                { text: '操作系统核心', link: '/foundation/os-core' }
              ]
            }
          ]
        }
      ],
      
      // 灵感想法侧边栏
      '/ideas/': [
        {
          text: '💡 灵感想法',
          link: '/ideas/',
          collapsed: true,
          items: [
            { text: '📄 概览', link: '/ideas/' },
            {
              text: '🚀 产品想法',
              link: '/ideas/products/',
              collapsed: true,
              items: [
                { text: '📄 概览', link: '/ideas/products/' },
                { text: 'AI 助手功能', link: '/ideas/products/ai-assistant-features' }
              ]
            },
            {
              text: '🔬 技术探索',
              link: '/ideas/tech/',
              collapsed: true,
              items: [
                { text: '📄 概览', link: '/ideas/tech/' }
              ]
            },
            {
              text: '🌸 生活感悟',
              link: '/ideas/life/',
              collapsed: true,
              items: [
                { text: '📄 概览', link: '/ideas/life/' }
              ]
            }
          ]
        }
      ],
      
      // 项目记录侧边栏
      '/projects/': [
        {
          text: '🛠️ 项目记录',
          link: '/projects/',
          collapsed: true,
          items: [
            { text: '📄 概览', link: '/projects/' },
            {
              text: '🤖 抖尘 AI 中台',
              link: '/projects/ai-platform/',
              collapsed: true,
              items: [
                { text: '📄 概览', link: '/projects/ai-platform/' }
              ]
            },
            {
              text: '📊 CRM 系统',
              link: '/projects/crm/',
              collapsed: true,
              items: [
                { text: '📄 概览', link: '/projects/crm/' }
              ]
            },
            {
              text: '🎮 个人项目',
              link: '/projects/personal/',
              collapsed: true,
              items: [
                { text: '📄 概览', link: '/projects/personal/' }
              ]
            },
            {
              text: '📝 项目实战',
              link: '/project/',
              collapsed: true,
              items: [
                { text: '📄 概览', link: '/project/' },
                { text: '秒杀系统', link: '/project/seckill' }
              ]
            }
          ]
        }
      ],
      
      // 读书笔记侧边栏
      '/books/': [
        {
          text: '📖 读书笔记',
          link: '/books/',
          collapsed: true,
          items: [
            { text: '📄 概览', link: '/books/' },
            {
              text: '💻 技术书籍',
              link: '/books/tech/',
              collapsed: true,
              items: [
                { text: '📄 概览', link: '/books/tech/' }
              ]
            },
            {
              text: '📚 非技术书籍',
              link: '/books/non-tech/',
              collapsed: true,
              items: [
                { text: '📄 概览', link: '/books/non-tech/' }
              ]
            }
          ]
        }
      ],
      
      // OpenClaw 专题侧边栏
      '/openclaw/': [
        {
          text: '🐕 OpenClaw 专题',
          link: '/openclaw/',
          collapsed: false,
          items: [
            { text: '📄 概览', link: '/openclaw/' },
            { text: '介绍', link: '/openclaw/intro' },
            { text: '安装指南', link: '/openclaw/install' },
            { text: '快速开始', link: '/openclaw/quickstart' },
            { text: 'Skills 系统', link: '/openclaw/skills' },
            { text: '高级用法', link: '/openclaw/advanced' }
          ]
        }
      ]
    },

    socialLinks: [
      { icon: 'github', link: 'https://github.com/donkeyyz/beichuan-blog' }
    ],

    footer: {
      message: 'Made with ❤️ by 小谷',
      copyright: 'Copyright © 2024 北川'
    }
  },
  
  // 忽略死链检查
  ignoreDeadLinks: true
})
