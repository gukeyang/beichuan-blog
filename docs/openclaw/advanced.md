# OpenClaw 高级用法

深入探索 OpenClaw 的高级功能。

## 子代理系统

### 创建子代理

```javascript
// 在对话中
sessions_spawn({
  task: "分析这个代码库",
  runtime: "subagent",
  mode: "run"
})
```

### 子代理类型

- **subagent**: OpenClaw 子代理
- **acp**: ACP 编码会话

### 子代理管理

```bash
# 列出子代理
subagents list

# 终止子代理
subagents kill <id>

# 指导子代理
subagents steer <id> --message "新指令"
```

## Cron 定时任务

### 创建定时任务

```bash
cron add --job '{
  "name": "每日提醒",
  "schedule": {"kind": "cron", "expr": "0 9 * * *"},
  "payload": {"kind": "systemEvent", "text": "早安提醒"},
  "sessionTarget": "main"
}'
```

### 任务类型

- **systemEvent**: 系统事件（主会话）
- **agentTurn**: AI 回合（隔离会话）

### 管理任务

```bash
# 列出任务
cron list

# 运行任务
cron run <jobId>

# 删除任务
cron remove <jobId>

# 查看历史
cron runs <jobId>
```

## 记忆系统

### 记忆文件

- **MEMORY.md**: 长期记忆
- **memory/YYYY-MM-DD.md**: 日常笔记
- **HEARTBEAT.md**: 心跳任务配置

### 记忆操作

```javascript
// 搜索记忆
memory_search({query: "之前的项目"})

// 读取片段
memory_get({path: "MEMORY.md", from: 10, lines: 5})
```

## 多通道配置

### 配置示例

```json
{
  "channels": {
    "webchat": {"enabled": true, "port": 3000},
    "telegram": {"enabled": true, "botToken": "xxx"},
    "discord": {"enabled": true, "botToken": "xxx"}
  }
}
```

### 通道切换

AI 自动识别消息来源并路由回复。

## 模型配置

### 多模型支持

```json
{
  "model": {
    "default": "qwen-max",
    "aliases": {
      "glm-5": "custom-open-bigmodel-cn/glm-5",
      "Kimi": "moonshot/kimi-k2.5"
    }
  }
}
```

### 会话级模型覆盖

```
/session_status --model glm-5
```

## 浏览器自动化

### 基本操作

```javascript
browser({
  action: "open",
  url: "https://example.com"
})

browser({
  action: "snapshot"
})

browser({
  action: "act",
  request: {
    kind: "click",
    ref: "e12"
  }
})
```

### 高级用法

- 使用 Playwright 选择器
- 处理弹窗和对话框
- 截图和 PDF 导出

## Feishu 集成

### 可用操作

- `feishu_doc`: 文档管理
- `feishu_bitable`: 多维表格
- `feishu_drive`: 云盘
- `feishu_wiki`: 知识库
- `feishu_chat`: 聊天

### 示例：创建文档

```javascript
feishu_doc({
  action: "create",
  title: "新文档",
  content: "# 标题\n\n内容"
})
```

## 性能优化

### 上下文管理

- 使用 `memory_search` 而非加载整个文件
- 合理设置 `limit` 参数
- 定期清理旧记忆

### 任务批处理

- 合并多个小任务
- 使用子代理并行处理
- 避免频繁的 Gateway 重启

## 调试技巧

### 查看日志

```bash
openclaw gateway logs --follow
```

### 会话状态

```bash
openclaw sessions list
```

### 配置检查

```bash
openclaw gateway config.get
```

## 相关文档

- [介绍](/openclaw/intro)
- [Skills 系统](/openclaw/skills)
