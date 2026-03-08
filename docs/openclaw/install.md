# 安装指南

本指南将帮助你在不同平台上安装 OpenClaw。

## 📋 前置要求

- Node.js 18+ (推荐 v20+)
- npm 或 pnpm
- Git

## 🚀 快速安装

### 使用 npm

```bash
npm install -g openclaw
```

### 使用 pnpm

```bash
pnpm add -g openclaw
```

### 验证安装

```bash
openclaw --version
```

## 🖥️ 平台特定指南

### Windows

1. 安装 [Node.js](https://nodejs.org/)
2. 以管理员身份运行 PowerShell
3. 执行安装命令：
   ```powershell
   npm install -g openclaw
   ```

### macOS

```bash
# 使用 Homebrew 安装 Node.js
brew install node

# 安装 OpenClaw
npm install -g openclaw
```

### Linux

```bash
# Ubuntu/Debian
curl -fsSL https://deb.nodesource.com/setup_20.x | sudo -E bash -
sudo apt-get install -y nodejs

# 安装 OpenClaw
npm install -g openclaw
```

## 🔧 初始化工作区

安装完成后，初始化你的工作区：

```bash
# 创建工作区目录
mkdir -p ~/openclaw-workspace
cd ~/openclaw-workspace

# 初始化
openclaw init
```

初始化会创建以下结构：

```
workspace/
├── SOUL.md          # 助手人格定义
├── USER.md          # 用户信息
├── MEMORY.md        # 长期记忆
├── IDENTITY.md      # 助手身份
├── TOOLS.md         # 工具配置
├── HEARTBEAT.md     # 心跳任务
├── memory/          # 日常记忆
└── skills/          # 自定义技能
```

## 🔑 配置平台连接

### WhatsApp

```bash
openclaw connect whatsapp
```

扫描显示的 QR 码即可连接。

### Telegram

1. 联系 [@BotFather](https://t.me/BotFather)
2. 创建新 Bot
3. 获取 Token
4. 配置到 OpenClaw：
   ```bash
   openclaw config set telegram.token YOUR_BOT_TOKEN
   ```

### Discord

1. 创建 Discord 应用
2. 获取 Bot Token
3. 邀请 Bot 到服务器
4. 配置：
   ```bash
   openclaw config set discord.token YOUR_BOT_TOKEN
   ```

## ✅ 验证安装

运行健康检查：

```bash
openclaw status
```

你应该看到类似输出：

```
✅ Gateway: Running
✅ Workspace: ~/openclaw-workspace
✅ Model: configured
✅ Channels: 0 connected
```

## 🐛 常见问题

### 权限错误

如果遇到 `EACCES` 错误：

```bash
# npm 全局安装权限问题
npm config set prefix ~/.npm-global
export PATH=~/.npm-global/bin:$PATH
```

### Node 版本过低

```bash
# 使用 nvm 管理 Node 版本
nvm install 20
nvm use 20
```

### 防火墙问题

确保以下端口可用：
- Gateway API: 3000 (默认)

## 📚 下一步

- [快速开始](/openclaw/quickstart)
- [技能系统](/openclaw/skills)
