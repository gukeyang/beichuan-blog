# Git 使用指南

Git 是分布式版本控制系统，是现代开发的必备工具。

## 常用命令

### 基础操作

```bash
# 初始化仓库
git init

# 克隆仓库
git clone <url>

# 查看状态
git status

# 添加文件
git add .

# 提交
git commit -m "message"

# 推送
git push origin main
```

### 分支管理

```bash
# 创建分支
git branch <name>

# 切换分支
git checkout <name>

# 创建并切换
git checkout -b <name>

# 合并分支
git merge <branch>

# 删除分支
git branch -d <name>
```

### 远程操作

```bash
# 添加远程
git remote add origin <url>

# 查看远程
git remote -v

# 拉取
git pull origin main

# 推送
git push origin main
```

## Git Flow

- **main**: 主分支，生产环境代码
- **develop**: 开发分支
- **feature/**: 功能分支
- **release/**: 发布分支
- **hotfix/**: 热修复分支

## 相关文档

- [CI/CD](/notes/engineering/cicd)
