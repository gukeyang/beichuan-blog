# 北川博客 - 北川的知识库

一个基于 VitePress 的技术博客，专注于后端开发技术分享、学习笔记和项目记录。

**🌐 在线访问**: [https://beichuan-blog.vercel.app](https://beichuan-blog.vercel.app)

## 📚 项目结构

```
beichuan-blog/
├── docs/                      # 文档根目录
│   ├── .vitepress/           # VitePress 配置文件
│   │   └── config.ts         # 主配置文件（侧边栏、导航等）
│   ├── notes/                # 学习笔记
│   │   ├── java/            # Java 后端
│   │   ├── spring/          # Spring 全家桶
│   │   ├── ai/              # AI/机器学习
│   │   ├── database/        # 数据库
│   │   ├── frontend/        # 前端开发
│   │   ├── devops/          # DevOps
│   │   ├── middleware/      # 中间件
│   │   ├── network/         # 网络协议
│   │   ├── os/              # 操作系统
│   │   ├── algorithm/       # 算法与数据结构
│   │   └── foundation/      # 计算机基础
│   ├── ideas/               # 灵感想法
│   │   ├── products/        # 产品想法
│   │   ├── tech/            # 技术探索
│   │   └── life/            # 生活感悟
│   ├── projects/            # 项目记录
│   │   ├── ai-platform/     # 抖尘 AI 中台
│   │   ├── crm/             # CRM 系统
│   │   ├── personal/        # 个人项目
│   │   └── project/         # 项目实战
│   ├── books/               # 读书笔记
│   │   ├── tech/            # 技术书籍
│   │   └── non-tech/        # 非技术书籍
│   ├── openclaw/            # OpenClaw 专题
│   └── index.md             # 首页
├── package.json
└── README.md
```

## 🚀 快速开始

### 安装依赖

```bash
npm install
```

### 启动开发服务器

```bash
npm run dev
```

访问 `http://localhost:5173` 预览博客。

### 构建生产版本

```bash
npm run build
```

### 预览构建结果

```bash
npm run preview
```

## ✍️ 如何添加文章

### 方法 1: 添加已有分类的文章

**步骤 1**: 在对应分类目录下创建 Markdown 文件

```bash
# 例如添加 Java 相关文章到学习笔记
touch docs/notes/java/your-article.md

# 或添加项目记录
touch docs/projects/ai-platform/your-project.md
```

**步骤 2**: 编写文章内容

```markdown
# 文章标题

文章简介或引言。

## 章节标题

文章内容...

## 代码示例

```java
public class Example {
    public static void main(String[] args) {
        System.out.println("Hello World");
    }
}
```
```

**步骤 3**: 在 `docs/.vitepress/config.ts` 中添加侧边栏链接

找到对应的分类，在 `items` 数组中添加：

```typescript
{
  text: '☕ Java 后端',
  link: '/notes/java/',
  collapsed: true,
  items: [
    { text: '📄 概览', link: '/notes/java/' },
    { text: '你的文章', link: '/notes/java/your-article' }  // ← 添加这行
  ]
}
```

**步骤 4**: 提交并推送

```bash
git add .
git commit -m "docs(java): 添加你的文章标题"
git push origin main
```

Vercel 会自动部署，无需手动配置！

### 方法 2: 创建新的分类栏目

**步骤 1**: 创建分类目录和 index.md

```bash
mkdir -p docs/notes/new-category
touch docs/notes/new-category/index.md
```

**步骤 2**: 编写分类首页

```markdown
# 新分类名称

分类简介...

## 文章列表

- [文章 1](/notes/new-category/article-1)
- [文章 2](/notes/new-category/article-2)
```

**步骤 3**: 在 `config.ts` 中添加侧边栏配置

在 `sidebar` 对象中添加新的分类：

```typescript
sidebar: {
  '/notes/new-category/': [
    {
      text: '📚 新分类',
      link: '/notes/new-category/',
      collapsed: false,
      items: [
        { text: '📄 概览', link: '/notes/new-category/' },
        { text: '文章 1', link: '/notes/new-category/article-1' },
        { text: '文章 2', link: '/notes/new-category/article-2' }
      ]
    }
  ]
}
```

**步骤 4**: 在顶部导航中添加链接（可选）

在 `themeConfig.nav` 中添加：

```typescript
nav: [
  { text: '🏠 首页', link: '/' },
  { text: '🆕 新分类', link: '/notes/new-category/' }  // ← 添加这行
]
```

## 🗑️ 如何删除文章

```bash
# 删除文章文件
rm docs/notes/java/old-article.md

# 在 config.ts 中移除对应的侧边栏链接

# 提交更改
git add .
git commit -m "docs(java): 删除旧文章"
git push origin main
```

## 📝 文章编写规范

1. **文件命名**: 使用小写字母和连字符，例如 `tcp-handshake.md`
2. **标题格式**: 使用一级标题 `#` 作为文章主标题
3. **章节结构**: 使用二级标题 `##` 作为主要章节，三级标题 `###` 作为子章节
4. **代码高亮**: 指定语言类型，如 \`\`\`java
5. **内容质量**: 确保内容准确、配合示例说明
6. **Front Matter**: 可选添加 YAML front matter 设置页面元数据

```markdown
---
title: 文章标题
date: 2024-01-01
tags: [Java, 后端]
---
```

## 🎨 侧边栏配置说明

侧边栏支持多级折叠展开，配置格式如下：

```typescript
sidebar: {
  '/notes/': [
    {
      text: '☕ Java 后端',          // 分类名称
      link: '/notes/java/',         // 分类首页链接
      collapsed: true,              // 默认折叠 (true) 或展开 (false)
      items: [                      // 子项目列表
        { text: '📄 概览', link: '/notes/java/' },
        { text: '文章 1', link: '/notes/java/article-1' },
        { text: '文章 2', link: '/notes/java/article-2' }
      ]
    }
  ]
}
```

### 侧边栏路径匹配规则

- 侧边栏配置使用**前缀匹配**
- 例如 `/notes/` 会匹配所有以 `/notes/` 开头的页面
- 更具体的路径优先级更高

## 🔧 自定义配置

### 修改网站信息

编辑 `docs/.vitepress/config.ts`：

```typescript
export default defineConfig({
  title: '你的网站标题',
  description: '你的网站描述',
  // ...
})
```

### 修改首页

编辑 `docs/index.md` 文件。

### 修改主题

编辑 `docs/.vitepress/theme/index.ts` 文件。

## 📊 文章统计

| 分类 | 文章数 | 分类 | 文章数 |
|------|--------|------|--------|
| Java | 8 | AI/ML | 7 |
| Spring | 6 | OpenClaw | 6 |
| 数据库 | 5 | 工程化 | 4 |
| Web | 3 | 网络 | 3 |
| 项目实战 | 2 | 操作系统 | 3 |
| 中间件 | 2 | 基础 | 2 |
| 算法 | 1 | 产品想法 | 1 |

**总计：80+ 篇文章** ✅

## 🔧 技术栈

- **框架**: VitePress 1.6.4
- **构建工具**: Vite
- **部署**: Vercel
- **主题**: Vitesse Light/Dark

## 📖 更多资源

- [VitePress 官方文档](https://vitepress.dev/)
- [Markdown 语法指南](https://www.markdownguide.org/)
- [GitHub 仓库](https://github.com/donkeyyz/beichuan-blog)

## 📄 许可证

MIT License
