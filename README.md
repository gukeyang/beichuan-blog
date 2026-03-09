# 北川博客

一个基于 VitePress 的技术博客，专注于后端开发技术分享。

## 📚 项目结构

```
docs/
├── .vitepress/          # VitePress 配置文件
├── ai/                  # AI 大模型应用开发
├── java/                # Java 核心
├── spring/              # Spring 全家桶
├── database/            # 数据库（MySQL、Redis）
├── web/                 # Web 开发
├── middleware/          # 中间件（Kafka、RabbitMQ）
├── engineering/         # 工程化（CI/CD、Docker）
├── foundation/          # 计算机基础
├── algorithm/           # 算法与数据结构
├── network/             # 网络协议
├── os/                  # 操作系统
├── project/             # 项目实战
├── openclaw/            # OpenClaw 自动化
└── index.md             # 首页
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

### 构建生产版本

```bash
npm run build
```

### 预览构建结果

```bash
npm run preview
```

## 📊 文章统计

| 分类 | 文章数 | 分类 | 文章数 |
|------|--------|------|--------|
| Java | 8 | AI 大模型 | 7 |
| Spring | 6 | OpenClaw | 6 |
| 数据库 | 5 | 工程化 | 4 |
| Web | 3 | 网络 | 3 |
| 项目实战 | 2 | 操作系统 | 2 |
| 中间件 | 2 | 基础 | 1 |
| 算法 | 1 | | |

**总计：50 篇文章**

## ✍️ 如何添加文章

### 步骤 1: 创建 Markdown 文件

在对应的分类目录下创建新的 `.md` 文件：

```bash
# 例如添加 Java 相关文章
touch docs/java/your-article.md
```

### 步骤 2: 编写文章内容

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

### 步骤 3: 提交并推送

```bash
git add .
git commit -m "docs(java): 添加你的文章标题"
git push origin main
```

Vercel 会自动部署，无需手动配置侧边栏！

## 🗑️ 如何删除文章

```bash
# 删除文章文件
rm docs/java/old-article.md

# 提交更改
git add .
git commit -m "docs(java): 删除旧文章"
git push origin main
```

## 📝 文章编写规范

1. **文件命名**：使用小写字母和连字符，例如 `tcp-handshake.md`
2. **标题格式**：使用一级标题 `#` 作为文章主标题
3. **章节结构**：使用二级标题 `##` 作为主要章节
4. **代码高亮**：指定语言类型，如 \`\`\`java
5. **内容质量**：确保内容准确、配合示例说明

## 🎨 自定义配置

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

## 🔧 技术栈

- **框架**：VitePress 1.6.4
- **构建工具**：Vite
- **部署**：Vercel
- **主题**：Vitesse Light/Dark

## 📖 更多资源

- [VitePress 官方文档](https://vitepress.dev/)
- [Markdown 语法指南](https://www.markdownguide.org/)
- [GitHub 仓库](https://github.com/gukeyang/beichuan-blog)

## 📄 许可证

MIT License
