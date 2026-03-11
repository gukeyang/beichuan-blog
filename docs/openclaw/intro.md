# OpenClaw 介绍

OpenClaw 是一个开源的 AI 助手框架，让你可以轻松构建自己的智能助手。

## 什么是 OpenClaw？

OpenClaw 是一个灵活的 AI 助手运行时，提供：

- **Skills 系统**: 可扩展的技能/插件机制
- **多通道支持**: Web、Telegram、WhatsApp、Discord 等
- **记忆系统**: 短期和长期记忆管理
- **任务调度**: Cron 和定时任务
- **子代理**: 多代理协作

## 核心特性

### 🧩 Skills 系统

通过 Skills 扩展功能：
- 文件系统操作
- 浏览器控制
- 消息发送
- 外部 API 集成

### 📡 多通道

支持多种通信渠道：
- Web Chat
- Telegram Bot
- WhatsApp
- Discord
- Slack

### 🧠 记忆管理

- **短期记忆**: 会话上下文
- **长期记忆**: MEMORY.md 文件
- **日常笔记**: memory/YYYY-MM-DD.md

### ⏰ 任务调度

- Cron 定时任务
- 一次性提醒
- 心跳检查

## 架构概览

```
┌─────────────────┐
│    用户界面     │
│  (Web/Telegram) │
└────────┬────────┘
         │
┌────────▼────────┐
│   OpenClaw      │
│    Gateway      │
└────────┬────────┘
         │
    ┌────┴────┐
    │         │
┌───▼──┐  ┌──▼─────┐
│ Sessions │  │ Cron  │
└───┬──┘  └──┬─────┘
    │         │
┌───▼─────────▼───┐
│   Skills/Tools  │
└─────────────────┘
```

## 快速开始

```bash
# 安装
npm install -g openclaw

# 初始化
openclaw init

# 启动
openclaw gateway start
```

## 相关文档

- [安装指南](/openclaw/install)
- [快速开始](/openclaw/quickstart)
- [Skills 系统](/openclaw/skills)

## 资源链接

- [官方文档](https://docs.openclaw.ai)
- [GitHub](https://github.com/openclaw/openclaw)
- [Skill 市场](https://clawhub.com)
- [Discord 社区](https://discord.gg/clawd)
