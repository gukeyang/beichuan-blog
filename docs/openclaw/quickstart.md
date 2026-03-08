# 快速开始

5 分钟让你的 AI 助手跑起来！

## 🎯 第一步：启动 Gateway

```bash
openclaw gateway start
```

等待 Gateway 启动完成：

```
✅ Gateway started
📍 Listening on http://localhost:3000
```

## 🤖 第二步：定义你的助手

编辑 `SOUL.md` 文件：

```markdown
# SOUL.md - 你的助手灵魂

## 性格
- 友好、专业、乐于助人
- 技术背景深厚
- 说话简洁明了

## 行为准则
- 优先解决问题
- 不确定时主动询问
- 记住用户偏好
```

## 👤 第三步：配置用户信息

编辑 `USER.md`：

```markdown
# 关于我

## 基本信息
- 名字：小明
- 职业：软件工程师
- 所在地：北京

## 偏好
- 沟通风格：简洁直接
- 语言：中文
```

## 💬 第四步：开始对话

### Web 界面

访问 `http://localhost:3000` 开始对话。

### 命令行

```bash
openclaw chat "你好，介绍一下你自己"
```

### 连接通讯平台

```bash
# WhatsApp
openclaw connect whatsapp

# Telegram
openclaw connect telegram

# Discord
openclaw connect discord
```

## 🛠️ 第五步：启用技能

### 查看可用技能

```bash
openclaw skills list
```

### 安装技能

```bash
# 从 ClawHub 安装
openclaw skills install weather
openclaw skills install github
openclaw skills install notion
```

### 启用技能

在配置中启用：

```yaml
# config.yaml
skills:
  enabled:
    - weather
    - github
    - notion
```

## 📝 第六步：测试功能

### 天气查询

```
明天北京天气怎么样？
```

### GitHub 操作

```
查看我最近的 PR
```

### 记忆功能

```
记住我喜欢喝美式咖啡
```

下次对话时助手会记得！

## 🎨 自定义助手人格

### 创建独特人设

编辑 `IDENTITY.md`：

```markdown
# IDENTITY.md

- **名字**: 小智
- **类型**: AI 助手
- **风格**: 温暖、幽默、专业
- **Emoji**: 🤖
```

### 定义行为规则

在 `SOUL.md` 中添加：

```markdown
## 特殊规则
- 早上 9 点前不主动发消息
- 涉及金钱操作必须确认
- 每天提醒喝水 3 次
```

## 🔍 调试技巧

### 查看日志

```bash
openclaw logs --follow
```

### 检查状态

```bash
openclaw status
```

### 测试技能

```bash
openclaw skills test weather
```

## 📚 学习更多

- [技能系统详解](/openclaw/skills)
- [高级配置](/openclaw/advanced)
- [官方文档](https://docs.openclaw.ai)

## 💡 小贴士

1. **定期清理记忆** - 避免 MEMORY.md 过大
2. **备份工作区** - `cp -r workspace workspace-backup`
3. **使用心跳** - 配置 HEARTBEAT.md 定期任务
4. **探索 ClawHub** - 发现更多社区技能
