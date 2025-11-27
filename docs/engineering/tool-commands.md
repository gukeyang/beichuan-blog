---
title: 工具命令
tags:
  - Linux
  - Docker
  - Git
categories: 场景题
abbrlink: 211c5c1e
date: 2025-11-01 17:41:03
---

## Git命令

 以下是 Git 日常开发中最常用的命令整理，按功能分类便于查阅：

### **一、初始化与配置**

- `git init`：在当前目录初始化一个新的 Git 仓库（生成`.git`目录）。
- `git config --global user.name "你的名字"`：设置全局用户名（所有仓库生效）。
- `git config --global user.email "你的邮箱"`：设置全局邮箱（所有仓库生效）。
- `git config --local user.name "名字"`：设置当前仓库的用户名（仅当前仓库生效，覆盖全局）。
- `git config --list`：查看当前 Git 配置（包括全局和本地）。

### **二、工作区与暂存区操作**

- `git add <文件名>`：将指定文件从工作区添加到暂存区（暂存修改）。
- `git add .`：将当前目录所有修改（新增、修改、删除）添加到暂存区。
- `git add -u`：仅添加已跟踪文件的修改 / 删除（不包含新增文件）。
- `git rm <文件名>`：删除工作区文件，并将删除操作添加到暂存区（等价于`rm <文件> + git add <文件>`）。
- `git rm --cached <文件名>`：从暂存区移除文件（保留工作区文件，即取消跟踪）。

### **三、提交与日志**

- `git commit -m "提交说明"`：将暂存区的内容提交到本地仓库，`-m`后为提交信息（必填）。
- `git commit -am "提交说明"`：直接提交已跟踪文件的修改（跳过`git add`，但不包含新增文件）。
- `git commit --amend`：修改最近一次提交（适用于补充提交信息或遗漏文件，需先`git add`遗漏文件）。
- `git log`：查看提交历史（按时间倒序，显示 commit-id、作者、时间、提交说明）。
- `git log --oneline`：简化日志输出（仅显示 commit-id 前 7 位和提交说明）。
- `git log --graph`：以图形化方式显示分支合并历史（直观看到分支走向）。
- `git reflog`：查看所有操作记录（包括已删除的提交，用于找回误删的版本）。

### **四、分支操作**

- `git branch`：查看本地所有分支（当前分支前有`*`标记）。
- `git branch <分支名>`：创建新分支（基于当前分支的最新提交）。
- `git switch <分支名>`：切换到指定分支（Git 2.23 + 新增，替代`git checkout`的分支切换功能，更清晰）。
- `git switch -c <分支名>`：创建并切换到新分支（等价于`git branch <分支名> + git switch <分支名>`）。
- `git merge <分支名>`：将指定分支合并到当前分支（如`git merge dev`：把 dev 分支合并到当前分支）。
- `git branch -d <分支名>`：删除已合并的本地分支（若未合并，需用`-D`强制删除）。
- `git branch -m <旧分支名> <新分支名>`：重命名本地分支。

### **五、远程仓库操作**

- `git clone <远程仓库地址>`：克隆远程仓库到本地（会自动创建本地仓库并关联远程）。
- `git remote add origin <远程仓库地址>`：将本地仓库关联到远程仓库（通常命名为`origin`）。
- `git remote -v`：查看当前仓库关联的远程仓库地址（`-v`显示详细信息）。
- `git pull`：拉取远程仓库的最新代码并合并到当前分支（等价于`git fetch + git merge`）。
- `git pull origin <远程分支名>`：拉取指定远程分支的代码并合并到当前分支。
- `git push`：将本地分支的提交推送到远程仓库（首次推送需指定远程和分支，如`git push -u origin main`）。
- `git push origin <本地分支名>:<远程分支名>`：将本地分支推送到远程指定分支（如本地 dev 推到远程 dev：`git push origin dev:dev`）。
- `git push origin --delete <远程分支名>`：删除远程仓库的指定分支。

### **六、撤销与回退**

- `git checkout -- <文件名>`：撤销工作区的修改（恢复到最近一次`commit`或`add`的状态，未`add`的修改会丢失）。
- `git reset HEAD <文件名>`：将暂存区的修改撤销回工作区（取消`git add`的效果）。
- `git reset --hard <commit-id>`：回退到指定版本（`commit-id`可通过`git log`获取，工作区和暂存区会被强制覆盖，谨慎使用）。
- `git reset --soft <commit-id>`：回退到指定版本，但保留工作区和暂存区的修改（仅撤销`commit`）。

### **七、其他常用命令**

- `git stash`：将当前工作区的修改临时保存（常用于切换分支前暂存未提交的修改）。
- `git stash pop`：恢复最近一次`stash`的内容，并删除该`stash`记录。
- `git stash list`：查看所有`stash`记录。
- `git diff`：查看工作区与暂存区的差异（未`add`的修改）。
- `git diff --cached`：查看暂存区与本地仓库的差异（已`add`但未`commit`的修改）。



## Linux命令

### **一、文件与目录操作**

- `ls`：列出目录内容
  - `ls -l`：显示详细信息（权限、大小、修改时间等）
  - `ls -a`：显示所有文件（包括隐藏文件，以`.`开头）
  - `ls -h`：以人类可读格式显示大小（如 K、M）
- `cd <目录名>`：切换目录
  - `cd ..`：回到上级目录
  - `cd ~`：回到当前用户的家目录
  - `cd -`：回到上一次所在目录
- `pwd`：显示当前所在目录的绝对路径
- `mkdir <目录名>`：创建目录
  - `mkdir -p a/b/c`：递归创建多级目录（如 a 下的 b 下的 c）
- `rmdir <目录名>`：删除空目录（非空目录需用`rm -r`）
- `touch <文件名>`：创建空文件（若文件已存在，更新修改时间）
- `cp <源文件> <目标路径>`：复制文件 / 目录
  - `cp -r <源目录> <目标路径>`：复制目录（递归）
  - `cp -i`：覆盖前提示确认
- `mv <源文件> <目标路径>`：移动 / 重命名文件 / 目录
  - 例：`mv file1.txt dir1/`（移动到 dir1）；`mv oldname.txt newname.txt`（重命名）
- `rm <文件名>`：删除文件 / 目录
  - `rm -r <目录名>`：删除目录（递归，包括子文件）
  - `rm -f <文件名>`：强制删除（不提示）
  - `rm -rf <目录名>`：强制删除目录（谨慎使用，避免误删）

### **二、文件内容查看与编辑**

- `cat <文件名>`：查看文件全部内容（适合短文件）
  - `cat -n <文件名>`：显示行号
- `more <文件名>`：分页查看文件（按空格翻页，`q`退出）
- `less <文件名>`：更灵活的分页查看（支持上下键滚动，`/关键词`搜索，`q`退出）
- `head <文件名>`：查看文件前 N 行（默认前 10 行）
  - `head -n 5 <文件名>`：查看前 5 行
- `tail <文件名>`：查看文件后 N 行（默认后 10 行）
  - `tail -n 5 <文件名>`：查看后 5 行
  - `tail -f <文件名>`：实时跟踪文件更新（常用于查看日志，`Ctrl+C`退出）
- `nano <文件名>`：简单文本编辑器（入门友好，`Ctrl+O`保存，`Ctrl+X`退出）
- `vim <文件名>`：强大的文本编辑器（需学习基础操作：`i`进入编辑模式，`Esc`退出编辑，`:wq`保存退出，`:q!`强制退出不保存）

### **三、系统信息与资源查看**

- `uname -a`：查看系统内核版本、主机名等详细信息
- `hostname`：查看当前主机名
- `date`：显示当前系统时间
- `cal`：显示当月日历（`cal 2024`显示 2024 年日历）
- `df -h`：查看磁盘分区使用情况（`-h`：人类可读格式）
- `du -sh <目录名>`：查看指定目录的总大小（`-s`：汇总，`-h`：可读格式）
- `free -h`：查看内存使用情况（`-h`：可读格式，显示总内存、已用、空闲等）
- `top`：实时查看进程资源占用（按`q`退出，`P`按 CPU 排序，`M`按内存排序）
- `htop`：更美观的进程监控工具（需安装，功能类似 top）

### **四、用户与权限管理**

- `whoami`：查看当前登录用户
- `who`：查看所有登录用户的信息
- `useradd <用户名>`：创建新用户（需 root 权限）
- `userdel -r <用户名>`：删除用户（`-r`：同时删除用户家目录）
- `passwd <用户名>`：修改用户密码（root 可改任意用户，普通用户改自己）
- `su <用户名>`：切换到指定用户（`su -`：切换并加载目标用户的环境变量）
- `sudo <命令>`：以 root 权限执行命令（需当前用户在 sudoers 列表中）
- `chmod <权限> <文件/目录>`：修改文件 / 目录权限
  - 权限格式：3 位数字（如`755`），分别代表所有者、所属组、其他用户的权限（r=4，w=2，x=1）
  - 例：`chmod 755 file.sh`（所有者可读可写可执行，组和其他用户可读可执行）
  - 符号格式：`chmod u+x file.sh`（给所有者添加执行权限，u = 所有者，g = 组，o = 其他）
- `chown <用户>:<组> <文件/目录>`：修改文件 / 目录的所有者和所属组
  - 例：`chown root:root file.txt`（改为 root 用户和 root 组所有）

### **五、进程管理**

- `ps`：查看当前终端的进程
  - `ps aux`：查看系统所有进程（a = 所有用户，u = 详细信息，x = 包括非终端进程）
  - `ps aux | grep <关键词>`：查找指定进程
- `kill <进程ID>`：终止指定进程（进程 ID 通过`ps`获取）
  - `kill -9 <进程ID>`：强制终止进程（无法忽略的信号）
- `pkill <进程名>`：按进程名终止进程（例：`pkill firefox`关闭所有火狐进程）
- `bg`：将前台进程切换到后台运行（需先按`Ctrl+Z`暂停前台进程）
- `fg`：将后台进程切换到前台

### **六、网络操作**

- `ifconfig` 或 `ip addr`：查看网络接口信息（IP 地址、MAC 地址等）
- `ping <IP/域名>`：测试与目标主机的连通性（`Ctrl+C`停止）
  - `ping -c 4 <IP>`：只发送 4 个数据包
- `netstat -tuln` 或 `ss -tuln`：查看系统监听的端口（t=TCP，u=UDP，l = 监听，n = 数字显示）
- `netstat -an`：查看所有网络连接
- `wget <URL>`：下载文件（例：`wget https://example.com/file.zip`）
- `curl <URL>`：发送 HTTP 请求或下载文件（例：`curl -O https://example.com/file.zip`保存文件）
- `ssh <用户名>@<IP/域名>`：通过 SSH 登录远程服务器（例：`ssh root@192.168.1.1`）

### **七、压缩与解压**

- `tar`：打包 / 解压文件（常用格式：.tar、.tar.gz、.tar.bz2）
  - 打包压缩：`tar -zcvf 文件名.tar.gz 源文件/目录`（z=gzip 压缩，c = 创建，v = 显示过程，f = 指定文件名）
  - 解压：`tar -zxvf 文件名.tar.gz`（x = 解压）
  - 解压到指定目录：`tar -zxvf 文件名.tar.gz -C 目标目录`
- `zip 压缩包名.zip 源文件/目录`：创建 zip 压缩包
- `unzip 压缩包名.zip`：解压 zip 压缩包
- `unzip 压缩包名.zip -d 目标目录`：解压到指定目录

### **八、文本处理工具**

- `grep <关键词> <文件名>`：在文件中搜索关键词
  - `grep -n <关键词> <文件名>`：显示匹配行的行号
  - `grep -r <关键词> <目录>`：递归搜索目录下所有文件
- `wc <文件名>`：统计文件的行数、单词数、字符数
  - `wc -l <文件名>`：只统计行数（常用于统计日志行数）
- `sort <文件名>`：对文件内容排序（默认按字符顺序）
  - `sort -n <文件名>`：按数字排序
  - `sort -r <文件名>`：倒序排序
- `sed 's/旧内容/新内容/g' <文件名>`：文本替换（例：`sed 's/hello/world/g' file.txt`替换所有 hello 为 world）

### **九、其他常用命令**

- `man <命令>`：查看命令的帮助手册（例：`man ls`查看 ls 的用法）
- `find <目录> -name <文件名>`：在指定目录下查找文件（例：`find /home -name "*.txt"`查找所有 txt 文件）
- `which <命令>`：查看命令的安装路径（例：`which python`）
- `clear` 或 `Ctrl+L`：清空终端屏幕
- `history`：查看历史命令（`!n`执行第 n 条历史命令）



## Docker命令

### **一、容器管理（最核心）**

容器是 Docker 的运行实例，以下命令用于容器的创建、启停、查看等操作。

- `docker run [选项] <镜像名>`：创建并启动容器（最常用命令）常用选项：
  - `-d`：后台运行容器（守护进程模式）
  - `-p 主机端口:容器端口`：端口映射（如`-p 8080:80`将主机 8080 映射到容器 80）
  - `-v 主机路径:容器路径`：挂载主机目录 / 文件到容器（实现数据持久化）
  - `--name <容器名>`：指定容器名称（否则自动生成）
  - `--rm`：容器停止后自动删除（适合临时任务）
  - `-it`：交互式运行（分配终端，常用于进入容器操作，如`docker run -it ubuntu /bin/bash`）
- `docker ps`：查看正在运行的容器
  - `docker ps -a`：查看所有容器（包括已停止的）
  - `docker ps -q`：只显示容器 ID（常用于批量操作）
- `docker start <容器名/ID>`：启动已停止的容器
- `docker stop <容器名/ID>`：停止运行中的容器
- `docker restart <容器名/ID>`：重启容器
- `docker kill <容器名/ID>`：强制终止容器（类似`kill -9`）
- `docker rm <容器名/ID>`：删除已停止的容器
  - `docker rm -f <容器名/ID>`：强制删除运行中的容器
  - `docker rm $(docker ps -aq)`：删除所有容器（谨慎使用）
- `docker exec [选项] <容器名/ID> <命令>`：在运行的容器中执行命令常用：`docker exec -it <容器名> /bin/bash`（进入容器终端，`exit`退出不影响容器运行）
- `docker logs [选项] <容器名/ID>`：查看容器日志
  - `-f`：实时跟踪日志（类似`tail -f`）
  - `-n 100`：显示最后 100 行日志
- `docker inspect <容器名/ID>`：查看容器详细信息（配置、网络、挂载等）

### **二、镜像管理**

镜像是容器的 "模板"，以下命令用于镜像的获取、构建、删除等。

- `docker pull <镜像名:标签>`：从仓库拉取镜像（默认拉取`latest`标签，如`docker pull nginx:1.25`）
- `docker images`：查看本地所有镜像
  - `docker images -q`：只显示镜像 ID
- `docker rmi <镜像名/ID>`：删除本地镜像
  - `docker rmi -f <镜像名/ID>`：强制删除（即使有容器依赖）
  - `docker rmi $(docker images -q)`：删除所有镜像（谨慎使用）
- `docker build -t <镜像名:标签> <Dockerfile路径>`：根据 Dockerfile 构建镜像例：`docker build -t myapp:v1 .`（`.`表示当前目录的 Dockerfile）
- `docker tag <原镜像名:标签> <新镜像名:标签>`：给镜像打标签（常用于推送镜像到仓库前重命名）例：`docker tag myapp:v1 username/myapp:v1`（适配仓库命名规范）
- `docker push <镜像名:标签>`：将镜像推送到远程仓库（如 Docker Hub，需先`docker login`登录）
- `docker save -o <保存路径.tar> <镜像名>`：将镜像导出为本地文件
- `docker load -i <镜像文件.tar>`：从本地文件导入镜像

### **三、数据卷（数据持久化）**

数据卷是独立于容器的存储区域，用于持久化容器数据（避免容器删除后数据丢失）。

- `docker volume create <卷名>`：创建数据卷
- `docker volume ls`：查看所有数据卷
- `docker volume inspect <卷名>`：查看数据卷详细信息（如挂载路径）
- `docker volume rm <卷名>`：删除数据卷
- `docker volume prune`：删除所有未使用的数据卷

### **四、网络管理**

Docker 网络用于容器间通信或容器与外部网络交互。

- `docker network ls`：查看所有 Docker 网络
- `docker network create <网络名>`：创建自定义网络（默认桥接模式）
- `docker network connect <网络名> <容器名>`：将容器连接到指定网络
- `docker network disconnect <网络名> <容器名>`：断开容器与网络的连接
- `docker network rm <网络名>`：删除网络
- `docker network inspect <网络名>`：查看网络详细信息（包含连接的容器等）

### **五、Docker Compose（多容器管理）**

用于定义和运行多容器应用（通过`docker-compose.yml`配置）。

- `docker-compose up`：创建并启动所有服务（基于`docker-compose.yml`）
  - `-d`：后台运行
  - `--build`：启动前重新构建镜像
- `docker-compose down`：停止并删除所有服务、网络（保留数据卷）
- `docker-compose start/stop/restart`：启动 / 停止 / 重启所有服务
- `docker-compose ps`：查看所有服务的容器状态
- `docker-compose logs [服务名]`：查看服务日志（`-f`实时跟踪）
- `docker-compose exec <服务名> <命令>`：在指定服务的容器中执行命令

### **六、系统与清理**

- `docker info`：查看 Docker 系统信息（版本、镜像数、容器数等）
- `docker version`：查看 Docker 客户端和服务器版本
- `docker system df`：查看 Docker 磁盘使用情况（镜像、容器、数据卷等）
- `docker system prune`：清理未使用的资源（停止的容器、无用镜像、未使用的网络）
  - `docker system prune -a`：清理更彻底（包括未被任何容器引用的镜像）

## DockerFile 

### **一、基础镜像与构建上下文**

#### `FROM`

- **语法**：`FROM <镜像名:标签>`

- **功能**：指定构建新镜像的基础镜像（所有镜像都基于其他镜像，必填指令）。

- 示例：

  ```dockerfile
  FROM ubuntu:22.04  # 基于Ubuntu 22.04
  FROM python:3.9-slim  # 基于轻量Python 3.9镜像
  ```

### **二、工作目录与路径配置**

#### `WORKDIR`

- **语法**：`WORKDIR <路径>`

- **功能**：设置后续指令（`RUN`/`COPY`/`CMD`等）的工作目录（类似`cd`，但持久化到镜像层）。

- 示例：

  ```dockerfile
  WORKDIR /app  # 后续命令默认在/app目录执行
  WORKDIR src   # 切换到/app/src（基于上一层的工作目录）
  ```

### **三、文件复制与添加**

#### `COPY`

- **语法**：`COPY <宿主机源路径> <镜像目标路径>`

- **功能**：将宿主机文件 / 目录复制到镜像中（仅复制，不自动解压）。

- 示例：

  ```dockerfile
  COPY app.py /app/  # 复制单个文件
  COPY src/ /app/src/  # 复制目录（包括子文件）
  ```

#### `ADD`

- **语法**：`ADD <源路径/URL> <目标路径>`

- **功能**：类似`COPY`，但支持：① 自动解压本地压缩包（如`.tar`/`.gz`）；② 通过 URL 下载文件（不推荐，建议用`RUN wget`）。

- 示例：

  ```dockerfile
  ADD archive.tar.gz /app/  # 复制并解压压缩包到/app
  ```

### **四、构建时执行命令**

#### `RUN`

- 语法：

  - shell 格式：`RUN <命令>`（如终端执行）
  - exec 格式：`RUN ["可执行文件", "参数1"]`（推荐，避免 shell 解析问题）

- **功能**：在镜像构建过程中执行命令（如安装依赖、编译代码），每行会生成新镜像层。

- 示例：

  ```dockerfile
  # 合并命令减少层数（推荐）
  RUN apt-get update && \
      apt-get install -y nginx && \
      apt-get clean  # 清理缓存减小体积
  
  RUN ["pip", "install", "-r", "requirements.txt"]  # exec格式
  ```

  

### **五、环境配置**

#### `ENV`

- **语法**：`ENV <键>=<值> ...`

- **功能**：定义环境变量（构建时和容器运行时均有效）。

- 示例：

  ```dockerfile
  ENV APP_PORT=8080  # 单个变量
  ENV DB_HOST=localhost DB_PORT=3306  # 多个变量
  ```

#### `ARG`

- **语法**：`ARG <变量名>=<默认值>`

- **功能**：定义构建时临时变量（仅`docker build`时有效，容器运行时不可见），可通过`--build-arg`覆盖。

- 示例：

  ```dockerfile
  ARG VERSION=1.0
  # 构建时覆盖：docker build --build-arg VERSION=2.0 -t myapp .
  ```

  

### **六、容器运行配置**

#### `EXPOSE`

- **语法**：`EXPOSE <端口1> <端口2> ...`

- **功能**：声明容器运行时预期监听的端口（仅文档说明，需`docker run -p`手动映射）。

- 示例：

  ```dockerfile
  EXPOSE 80 443  # 声明监听80和443端口
  ```

#### `VOLUME`

- **语法**：`VOLUME ["<路径1>", "<路径2>"]`

- **功能**：声明数据卷（指定容器内需要持久化的目录，避免数据随容器删除丢失）。

- 示例：

  ```dockerfile
  VOLUME ["/data"]  # 容器内/data目录会被挂载为数据卷
  ```

#### `USER`

- **语法**：`USER <用户名/UID>`

- **功能**：指定后续指令的执行用户（默认`root`，切换非 root 用户提高安全性）。

- 示例：

  ```dockerfile
  RUN useradd appuser  # 先创建用户
  USER appuser  # 后续命令以appuser身份执行
  ```

  

### **七、容器启动命令**

#### `CMD`

- 语法：

  - shell 格式：`CMD <命令>`
  - exec 格式：`CMD ["可执行文件", "参数1"]`（推荐）

- **功能**：指定容器启动时默认执行的命令（一个 Dockerfile 仅最后一个`CMD`生效，可被`docker run`后的命令覆盖）。

- 示例：

  ```dockerfile
  CMD ["nginx", "-g", "daemon off;"]  # 启动nginx（前台运行）
  # 运行时覆盖：docker run myimage /bin/bash（进入bash）
  ```

#### `ENTRYPOINT`

- 语法：

  - shell 格式：`ENTRYPOINT <命令>`
  - exec 格式：`ENTRYPOINT ["可执行文件", "参数1"]`（推荐）

- **功能**：定义容器启动的 “入口程序”（不会被`docker run`后的命令覆盖，`CMD`可作为其参数）。

- 示例：

  ```dockerfile
  ENTRYPOINT ["echo"]  # 固定入口为echo
  CMD ["hello"]  # 默认参数为hello
  # 运行时：docker run myimage world → 输出"world"（CMD参数被替换）
  ```

  

### **八、其他辅助指令**

#### `LABEL`

- **语法**：`LABEL <键>=<值> ...`

- **功能**：为镜像添加元数据（如作者、描述），便于管理。

- 示例：

  ```dockerfile
  LABEL maintainer="dev@example.com" description="My App Image"
  ```

#### `ONBUILD`

- **语法**：`ONBUILD <指令>`

- **功能**：当当前镜像被作为基础镜像时，触发指定指令（用于 “父镜像” 定义子镜像的通用操作）。

- 示例：

  ```dockerfile
  # 父镜像中定义：子镜像构建时自动复制app代码
  ONBUILD COPY app/ /app/
  ```
