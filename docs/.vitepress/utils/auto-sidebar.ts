import fs from 'node:fs'
import path from 'node:path'

// 白名单目录，只有这些目录会生成侧边栏
const WHITE_LIST = [
  'java',
  'database',
  'web',
  'spring',
  'middleware',
  'engineering',
  'foundation',
  'project',
  'openclaw',
  'ai'
]

// 目录名称映射（用于 Nav 显示中文）
const DIR_NAME_MAP: Record<string, string> = {
  java: 'Java 基础',
  database: '数据库',
  web: 'Web 开发',
  spring: 'Spring 全家桶',
  middleware: '中间件',
  engineering: '工程化',
  foundation: '计算机基础',
  project: '项目实战',
  openclaw: 'OpenClaw',
  ai: 'AI 大模型'
}

// 忽略的文件
const IGNORE_FILES = ['index.md', '.DS_Store']

/**
 * 扫描目录生成 Sidebar
 * @param {string} rootPath 文档根目录
 */
export function generateSidebar(rootPath: string) {
  const sidebar: Record<string, any[]> = {}

  WHITE_LIST.forEach(dir => {
    const dirPath = path.join(rootPath, dir)
    if (fs.existsSync(dirPath)) {
      const items = fs.readdirSync(dirPath)
        .filter(file => !IGNORE_FILES.includes(file) && file.endsWith('.md'))
        .map(file => {
          const filePath = path.join(dirPath, file)
          const content = fs.readFileSync(filePath, 'utf-8')
          // 尝试从文件内容中提取一级标题 (# Title)
          const match = content.match(/^#\s+(.+)$/m)
          const title = match ? match[1] : file.replace('.md', '')
          
          return {
            text: title,
            link: `/${dir}/${file.replace('.md', '')}`
          }
        })
        // 按文件名排序（可选，或者在 md frontmatter 中指定 order）
        .sort((a, b) => a.text.localeCompare(b.text, 'zh-CN'))

      // 生成 Sidebar 结构
      sidebar[`/${dir}/`] = [
        {
          text: DIR_NAME_MAP[dir] || dir.toUpperCase(),
          items: items,
          collapsed: false
        }
      ]
    }
  })

  return sidebar
}

/**
 * 生成 Nav 配置
 */
export function generateNav() {
  return [
    { text: '首页', link: '/' },
    { 
      text: '面试指南', 
      items: [
        { text: 'Java 基础', link: '/java/' },
        { text: '数据库', link: '/database/' },
        { text: '计算机基础', link: '/foundation/' },
      ]
    },
    { 
      text: '常用框架', 
      items: [
        { text: 'Spring 全家桶', link: '/spring/' },
        { text: 'Web 开发', link: '/web/' },
        { text: '中间件', link: '/middleware/' },
      ]
    },
    { text: 'AI 大模型', link: '/ai/' },
    { text: '工程化', link: '/engineering/' },
    { text: '实战项目', link: '/project/' },
    { text: 'OpenClaw', link: '/openclaw/' },
    { text: '更新日志', link: '/changelog' },
    { text: '知识星球', link: 'https://zsxq.com/' }
  ]
}
