# Git 常用命令速查手册

> Git 是目前世界上最先进的分布式版本控制系统。本文整理了日常开发中最常用的 Git 命令，涵盖从仓库初始化到高级操作的方方面面。

## 一、配置 (Configuration)

配置用户信息，确保提交记录有据可查。

```bash
# 设置全局用户名
git config --global user.name "你的名字"

# 设置全局邮箱
git config --global user.email "你的邮箱"

# 查看所有配置
git config --list

# 针对当前仓库设置特定用户 (覆盖全局)
git config --local user.name "Project User"
```

## 二、基础操作 (Basic)

日常开发的高频操作。

```bash
# 初始化仓库
git init

# 克隆远程仓库
git clone <URL>

# 查看文件状态
git status

# 添加文件到暂存区
git add <file>      # 添加指定文件
git add .           # 添加所有修改

# 提交到本地仓库
git commit -m "feat: 完成登录功能"

# 修改最后一次提交 (改注释或追加文件)
git commit --amend
```

## 三、分支管理 (Branching)

Git 的杀手锏功能，轻量级且高效。

```bash
# 查看本地分支
git branch

# 查看所有分支 (含远程)
git branch -a

# 创建新分支
git branch <branch-name>

# 切换分支
git checkout <branch-name>
# 或 (Git 2.23+)
git switch <branch-name>

# 创建并切换分支
git checkout -b <branch-name>

# 合并分支 (将 dev 合并到当前分支)
git merge dev

# 删除分支 (只能删除已合并的分支)
git branch -d <branch-name>

# 强制删除分支 (未合并也要删)
git branch -D <branch-name>
```

## 四、远程同步 (Remote)

与 GitHub/GitLab 等远程仓库交互。

```bash
# 查看远程仓库地址
git remote -v

# 添加远程仓库
git remote add origin <URL>

# 拉取代码 (fetch + merge)
git pull origin <branch-name>

# 推送代码
git push origin <branch-name>

# 强制推送 (慎用!)
git push -f origin <branch-name>

# 清理无效的远程分支引用
git remote prune origin
```

## 五、撤销与回滚 (Undo)

后悔药，但在使用 `reset --hard` 时需格外小心。

| 场景 | 命令 | 说明 |
| :--- | :--- | :--- |
| **丢弃工作区修改** | `git checkout -- <file>` | 文件回到最近一次 commit 或 add 的状态 |
| **暂存区回退到工作区** | `git reset HEAD <file>` | add 错了，想撤回来 |
| **回退到上个版本** | `git reset --hard HEAD^` | **危险**：工作区所有未提交修改都会丢失 |
| **回退到指定版本** | `git reset --hard <commit-id>` | **危险**：时光倒流 |
| **反转某次提交** | `git revert <commit-id>` | 生成一个新的提交，内容是原提交的反向操作 (安全) |

## 六、暂存 (Stashing)

正在开发某个功能，突然要修 Bug，但不想提交半成品？

```bash
# 暂存当前工作区
git stash save "正在开发登录功能"

# 查看暂存列表
git stash list

# 恢复最近一次暂存 (并从列表中删除)
git stash pop

# 恢复最近一次暂存 (保留在列表中)
git stash apply

# 清空所有暂存
git stash clear
```

## 七、标签 (Tagging)

用于标记发布版本。

```bash
# 打轻量标签
git tag v1.0.0

# 打附注标签 (推荐)
git tag -a v1.0.0 -m "Release version 1.0.0"

# 推送标签到远程
git push origin v1.0.0

# 删除本地标签
git tag -d v1.0.0

# 删除远程标签
git push origin :refs/tags/v1.0.0
```

## 八、高级技巧

### 1. 变基 (Rebase)

保持提交历史整洁线性的神器。

```bash
# 将当前分支变基到 master
git rebase master

# 交互式变基 (合并多个 commit)
git rebase -i HEAD~3
```

### 2. 拣选 (Cherry-pick)

只想要另一个分支的某次提交？

```bash
git cherry-pick <commit-id>
```

### 3. 查看日志

```bash
# 图形化显示日志
git log --graph --oneline --all
```
