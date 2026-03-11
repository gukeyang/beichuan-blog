# CI/CD

持续集成（CI）和持续部署（CD）是现代软件开发的自动化实践。

## 概念

- **CI (Continuous Integration)**: 持续集成，频繁合并代码到主分支，自动构建和测试
- **CD (Continuous Deployment)**: 持续部署，自动将通过测试的代码部署到生产环境

## 常见 CI/CD 工具

| 工具 | 特点 |
|------|------|
| GitHub Actions | GitHub 原生，配置简单 |
| Jenkins | 老牌工具，插件丰富 |
| GitLab CI | GitLab 内置 |
| CircleCI | 云原生，配置灵活 |
| Travis CI | 开源项目友好 |

## GitHub Actions 示例

```yaml
name: CI/CD Pipeline

on:
  push:
    branches: [main]
  pull_request:
    branches: [main]

jobs:
  build:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      
      - name: Setup Node.js
        uses: actions/setup-node@v3
        with:
          node-version: '18'
      
      - name: Install dependencies
        run: npm ci
      
      - name: Build
        run: npm run build
      
      - name: Test
        run: npm test
```

## 相关文档

- [Git 使用指南](/notes/engineering/git)
