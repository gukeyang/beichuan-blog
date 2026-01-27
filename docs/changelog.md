# 更新日志 (Changelog)

记录本博客的主要更新内容与功能迭代。

## v1.2.0 (2024-01-27) - 深度优化与自动化

### 🌟 新增特性
- **动态侧边栏**: 实现了基于文件目录的侧边栏自动生成功能，无需手动维护 `config.ts`。
- **SEO 增强**: 
  - 集成了 `sitemap` 生成，构建时自动输出 `sitemap.xml`。
  - 全局添加了 `keywords` 和 `author` 元数据。
- **搜索升级**: 
  - 开启了 Local Search 的**详细视图 (Detailed View)**，支持预览搜索结果的正文内容。
  - 汉化了搜索界面的所有提示文案。

### 📚 内容更新
- **重写与扩充**:
  - `docs/engineering/cicd.md`: 补充了 GitLab CI + K8s 的完整 YAML 配置。
  - `docs/project/seckill.md`: 增加了 Redis Lua 脚本、Nginx 限流配置和数据库设计。
  - `docs/engineering/git.md`: 扩充为全能速查手册。
  - `docs/spring/architecture.md`: 增加了微服务拆分原则和架构对比。

---

## v1.1.0 (2024-01-27) - 内容迁移

### 📚 内容更新
- **从 gukeyang.github.io 迁移**:
  - 新增 [CI/CD 实战](/engineering/cicd)
  - 新增 [秒杀系统设计](/project/seckill)
  - 新增 [Git 常用命令](/engineering/git)
  - 新增 [架构演进](/spring/architecture)
- **文档补全**: 为 Java 基础、数据库、Spring、Web 等模块创建了占位文档。

---

## v1.0.0 (2024-01-27) - 初始化

### 🎉 项目启动
- 基于 **VitePress** 搭建技术博客。
- 配置了基础的主题、Logo 和目录结构。
- 规划了 Java 后端学习路径的大纲。
