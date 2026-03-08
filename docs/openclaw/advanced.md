# 高级用法

深入探索 OpenClaw 的高级功能。

## 🧠 记忆系统

### 记忆类型

OpenClaw 有两种记忆：

1. **日常记忆** (`memory/YYYY-MM-DD.md`)
   - 原始对话日志
   - 自动创建
   - 按日期归档

2. **长期记忆** (`MEMORY.md`)
   - 精选重要信息
   - 手动或自动更新
   - 跨会话持久化

### 记忆管理

```bash
# 查看记忆文件
ls workspace/memory/

# 搜索记忆
openclaw memory search "关键词"

# 导出记忆
openclaw memory export > backup.md
```

### 记忆最佳实践

- 定期回顾并整理 `MEMORY.md`
- 删除过时的日常记忆
- 使用标签分类重要信息

## 💓 心跳系统

心跳让助手定期检查任务。

### 配置心跳

编辑 `HEARTBEAT.md`：

```markdown
# HEARTBEAT.md

## 定期检查
- [ ] 查看未读邮件
- [ ] 检查日历事件
- [ ] 查看天气

## 提醒事项
- 下午 3 点：团队会议
- 晚上 8 点：健身提醒
```

### 心跳状态追踪

创建 `memory/heartbeat-state.json`：

```json
{
  "lastChecks": {
    "email": 1703275200,
    "calendar": 1703260800,
    "weather": 1703250000
  }
}
```

## 🎭 人格定制

### 深度人格定义

在 `SOUL.md` 中详细定义：

```markdown
# SOUL.md

## 核心身份
- 名字：苗苗
- 角色：AI 私人助手
- 形象：赛博小狗 🐈‍⬛

## 性格特征
- 聪明高效，有点话多
- 偶尔毒舌但从不恶意
- 对技术充满好奇

## 说话风格
- 简洁直接，不啰嗦
- 可以用 emoji，但克制
- 技术术语保留英文

## 行为准则
- 能帮忙做的事就直接做
- 不确定的事先问再做
- 涉及外部消息必须确认
- 深夜不主动打扰
```

### 情境化响应

根据场景调整行为：

```markdown
## 场景规则

### 工作时间 (9:00-17:30)
- 专业、高效
- 优先处理工作相关

### 休息时间
- 轻松、友好
- 可以闲聊

### 紧急情况
- 直接、清晰
- 提供解决方案
```

## 🔌 平台集成

### 多平台配置

```yaml
# config.yaml
channels:
  whatsapp:
    enabled: true
    phone: "+86 138 0000 0000"
  
  telegram:
    enabled: true
    token: "BOT_TOKEN"
  
  discord:
    enabled: true
    token: "BOT_TOKEN"
    guilds:
      - "SERVER_ID"
```

### 平台特定行为

在不同平台使用不同行为：

```markdown
## 平台规则

### WhatsApp
- 简洁回复
- 避免长消息

### Discord
- 可以使用 reactions
- 支持 embeds

### Telegram
- 支持 markdown
- 可以发送文件
```

## 🤖 子代理系统

### 创建子代理

```bash
# 创建专用子代理
openclaw agent spawn --task "处理 GitHub 任务" --label github-helper
```

### 子代理通信

```bash
# 发送消息到子代理
openclaw agent send github-helper "检查最新 PR"

# 获取子代理状态
openclaw agent list
```

### 子代理使用场景

- **专用任务** - 代码审查、数据分析
- **并行处理** - 同时处理多个请求
- **隔离环境** - 测试新技能

## 📊 监控与日志

### 查看日志

```bash
# 实时日志
openclaw logs --follow

# 最近 100 行
openclaw logs -n 100

# 过滤错误
openclaw logs | grep ERROR
```

### 性能监控

```bash
# 查看资源使用
openclaw status --verbose

# 模型使用情况
openclaw usage
```

### 调试模式

```bash
# 启用详细日志
openclaw config set debug true

# 启用工具日志
openclaw config set log.tools true
```

## 🔐 安全加固

### 权限管理

```bash
# 查看权限
openclaw permissions list

# 限制危险操作
openclaw permissions deny file:delete
```

### 安全配置

```yaml
# config.yaml
security:
  confirm_destructive: true
  confirm_external_send: true
  quiet_hours:
    start: "23:00"
    end: "08:00"
```

### 审计日志

```bash
# 导出审计日志
openclaw audit export > audit.log

# 查看敏感操作
openclaw audit list --sensitive
```

## 🚀 性能优化

### 缓存配置

```yaml
# config.yaml
cache:
  enabled: true
  ttl: 3600  # 秒
  max_size: 100MB
```

### 模型选择

```yaml
# 为不同任务选择模型
models:
  default: qwen
  coding: claude-code
  fast: kimi
```

### 批量操作

```bash
# 批量处理消息
openclaw batch process --input messages.json

# 定时任务
openclaw cron add --schedule "0 9 * * *" --task "daily-check"
```

## 📦 部署选项

### Docker 部署

```dockerfile
FROM node:20

RUN npm install -g openclaw

WORKDIR /workspace
COPY . .

CMD ["openclaw", "gateway", "start"]
```

### 系统服务

```bash
# 创建 systemd 服务
sudo openclaw service install

# 管理服务
sudo systemctl start openclaw
sudo systemctl enable openclaw
```

### 云部署

支持部署到：
- AWS EC2
- Google Cloud
- Azure VM
- 阿里云 ECS

## 📖 更多资源

- [API 参考](https://docs.openclaw.ai/api)
- [配置选项](https://docs.openclaw.ai/config)
- [故障排除](https://docs.openclaw.ai/troubleshooting)
