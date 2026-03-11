# OpenClaw 安装指南

详细安装步骤和配置说明。

## 系统要求

- Node.js >= 18.0.0
- npm >= 9.0.0
- 2GB+ 内存
- 1GB+ 磁盘空间

## 安装步骤

### 1. 安装 Node.js

```bash
# 使用 nvm (推荐)
curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.39.0/install.sh | bash
nvm install 18
nvm use 18

# 或者直接下载
# https://nodejs.org/
```

### 2. 安装 OpenClaw

```bash
npm install -g openclaw
```

### 3. 初始化工作区

```bash
# 创建工作区
mkdir ~/openclaw-workspace
cd ~/openclaw-workspace

# 初始化
openclaw init
```

### 4. 配置

编辑 `~/.openclaw/config.json`:

```json
{
  "model": {
    "provider": "your-provider",
    "apiKey": "your-api-key"
  },
  "channels": {
    "webchat": {
      "enabled": true,
      "port": 3000
    }
  }
}
```

## 通道配置

### Telegram

1. 联系 [@BotFather](https://t.me/BotFather) 创建 Bot
2. 获取 Bot Token
3. 添加到配置：

```json
{
  "channels": {
    "telegram": {
      "enabled": true,
      "botToken": "YOUR_BOT_TOKEN"
    }
  }
}
```

### WhatsApp

1. 运行 `openclaw whatsapp link`
2. 扫描二维码
3. 完成绑定

### Discord

1. 创建 Discord 应用
2. 获取 Bot Token
3. 邀请 Bot 到服务器

## 启动服务

```bash
# 启动 Gateway
openclaw gateway start

# 查看状态
openclaw gateway status

# 重启
openclaw gateway restart

# 停止
openclaw gateway stop
```

## 验证安装

```bash
# 检查状态
openclaw status

# 查看日志
openclaw gateway logs
```

## 常见问题

### 端口被占用

修改配置中的端口号，或使用：

```bash
lsof -i :3000
kill -9 <PID>
```

### API Key 错误

检查配置文件中的 API Key 是否正确，确保有足够的额度。

## 相关文档

- [介绍](/openclaw/intro)
- [快速开始](/openclaw/quickstart)
