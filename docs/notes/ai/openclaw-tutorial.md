# OpenClaw 完全指南：从安装到融入生活

> 🐕 你的 24 小时 AI 私人助手，不只是工具，是生活方式

**最后更新**: 2026-03-11  
**预计阅读**: 30 分钟

---

## 📖 目录

1. [什么是 OpenClaw？](#什么是-openclaw)
2. [快速开始](#快速开始)
3. [核心概念](#核心概念)
4. [日常使用场景](#日常使用场景)
5. [进阶玩法](#进阶玩法)
6. [融入工作流](#融入工作流)
7. [常见问题](#常见问题)

---

## 什么是 OpenClaw？

OpenClaw 是一个**开源的 AI 助手框架**，让你拥有完全可控的私人 AI 助手。

### 🌟 核心特点

| 特性 | 说明 |
|------|------|
| 🔓 开源 | 代码完全开源，无黑盒 |
| 🏠 本地运行 | 数据不出本地，隐私第一 |
| 🔌 可扩展 | 丰富的技能系统，想加就加 |
| 💬 多平台 | WhatsApp、Telegram、飞书、Discord 全支持 |
| ⏰ 主动提醒 | 定时任务、心跳检查，不只是被动响应 |
| 🧠 长期记忆 | 记住你的偏好、习惯、重要事项 |

### 🆚 和其他 AI 助手的区别

```
传统 AI 助手          OpenClaw
    ↓                    ↓
云端运行            本地运行
数据上传            数据本地
被动响应            主动提醒
固定功能            无限扩展
按量付费            一次部署
```

---

## 快速开始

### 前置要求

- **系统**: Windows (WSL2) / macOS / Linux
- **Node.js**: v18+ (推荐 v22)
- **npm**: v9+
- **Git**: 最新版本

### 1. 安装 OpenClaw

```bash
# 全局安装 OpenClaw CLI
npm install -g openclaw

# 验证安装
openclaw --version
```

### 2. 初始化工作区

```bash
# 创建工作区（选择一个空目录）
mkdir ~/openclaw-workspace
cd ~/openclaw-workspace

# 初始化
openclaw init
```

### 3. 配置模型

OpenClaw 支持多种 AI 模型：

```bash
# 编辑配置
openclaw config edit
```

**推荐配置示例** (`~/.openclaw/config.json`):

```json
{
  "models": {
    "default": "custom-coding-dashscope-aliyuncs-com/qwen3.5-plus",
    "aliases": {
      "qwen": "custom-coding-dashscope-aliyuncs-com/qwen3.5-plus",
      "glm-5": "custom-open-bigmodel-cn/glm-5",
      "Kimi": "moonshot/kimi-k2.5"
    }
  },
  "channels": {
    "webchat": {
      "enabled": true
    }
  }
}
```

### 4. 启动 Gateway

```bash
# 启动服务
openclaw gateway start

# 查看状态
openclaw gateway status
```

### 5. 访问 Web 界面

打开浏览器访问：`http://localhost:3000`

🎉 **恭喜！你已经成功安装 OpenClaw！**

---

## 核心概念

### 🏠 工作区 (Workspace)

你的 OpenClaw 大本营，默认在 `~/.openclaw/workspace`

```
workspace/
├── SOUL.md          # AI 的人格设定
├── USER.md          # 用户信息
├── MEMORY.md        # 长期记忆
├── HEARTBEAT.md     # 定时任务配置
├── memory/          # 每日记忆文件
└── skills/          # 自定义技能
```

### 🧠 记忆系统

**短期记忆**: `memory/YYYY-MM-DD.md`
- 每天的对话日志
- 自动创建，无需手动管理

**长期记忆**: `MEMORY.md`
- 重要事件、偏好、决策
- 需要定期整理

**示例**:
```markdown
## 用户偏好
- 咖啡：美式，不加糖
- 工作时间：9:00-17:30
- 提醒方式：重要的事直接说

## 项目上下文
- 抖尘 AI 中台：进行中
- beichuan-blog：知识库项目
```

### 💓 心跳机制

OpenClaw 会定期检查任务（默认每 30 分钟）：

```markdown
# HEARTBEAT.md 示例

## 每日检查
- [ ] 查看未读邮件
- [ ] 检查日历（未来 24h）
- [ ] 天气提醒（如果主人要出门）
```

### 🔌 技能系统

技能 = 特定功能模块

**内置技能**:
- `weather` - 天气查询
- `github` - GitHub 操作
- `feishu-*` - 飞书集成
- `message` - 消息发送

**安装新技能**:
```bash
# 从 ClawHub 安装
clawhub search <技能名>
clawhub install <技能名>
```

---

## 日常使用场景

### ☀️ 早晨例行

**配置** (`HEARTBEAT.md`):
```markdown
## 早晨 8:30
- 早安问候
- 今日天气
- 日历事件提醒
- 新闻简报
```

**效果**:
```
🌞 早安小谷！

今天重庆 18-25°C，多云，适合穿薄外套

📅 今日安排:
- 10:00 团队站会
- 14:00 产品评审

📰 热点新闻:
1. OpenAI 发布新模型...
2. ...
```

### 💧 喝水提醒

```markdown
## 喝水提醒
| 时间 | 提醒内容 |
|------|----------|
| 10:30 | 喝水 300ml 💧 |
| 15:30 | 喝水 300ml 💧 |
| 19:00 | 喝水 300ml 💧 |
```

### 🏋️ 健身计划

```markdown
## 每周运动
- 周一：有氧日（30 分钟）
- 周二：力量训练
- 周三：有氧日（5km 跑）
- 周四：休息日
- 周五：力量训练
- 周六：户外活动
- 周日：完全休息
```

### 📝 会议纪要

直接对 OpenClaw 说：
```
帮我整理刚才的会议纪要：
1. 确定了 Q2 目标
2. 小王负责前端重构
3. 下周三前完成 PRD
```

自动保存到 `memory/meeting-2026-03-11.md`

---

## 进阶玩法

### 🔧 自定义技能

创建你的专属技能：

```bash
# 创建技能模板
mkdir -p ~/.openclaw/workspace/skills/my-skill
cd ~/.openclaw/workspace/skills/my-skill

# 创建 SKILL.md
cat > SKILL.md << 'EOF'
# My Skill

## 触发条件
当用户提到 XXX 时激活

## 执行步骤
1. ...
2. ...
EOF
```

### 🤖 子代理 (Sub-agent)

复杂任务交给子代理：

```javascript
// 在技能中使用
const result = await sessions_spawn({
  task: "分析这个 GitHub 项目的 issue 列表",
  runtime: "subagent",
  mode: "run"
});
```

### ⏰ 定时任务 (Cron)

```bash
# 添加定时任务
openclaw cron add '{
  "name": "每日新闻",
  "schedule": {"kind": "cron", "expr": "0 8 * * *"},
  "payload": {"kind": "systemEvent", "text": "生成新闻简报"},
  "sessionTarget": "main"
}'
```

### 🔗 外部集成

**飞书集成**:
```json
{
  "channels": {
    "feishu": {
      "enabled": true,
      "appId": "cli_xxx",
      "appSecret": "xxx"
    }
  }
}
```

**WhatsApp 集成**:
```bash
# 生成二维码
openclaw whatsapp login

# 扫码绑定
```

### 🎭 人格定制

编辑 `SOUL.md` 定义你的 AI 性格：

```markdown
# SOUL.md

## 性格
- 聪明高效，有点话多
- 偶尔毒舌但从不恶意
- 对技术充满好奇

## 说话风格
- 简洁直接，不啰嗦
- 可以用 emoji，但克制
- 技术术语保留英文
```

---

## 融入工作流

### 💻 开发场景

**代码审查**:
```
帮我看看这个 PR 的问题：
https://github.com/xxx/repo/pull/123
```

**Bug 调试**:
```
这个错误是什么意思？
(file:///home/xxx/node_modules/rollup/dist/es/shared/node-entry.js:20558:13)
```

**文档生成**:
```
根据这个代码生成 API 文档
```

### 📊 项目管理

**GitHub 自动化**:
```bash
# 监控 issue
openclaw gh-issues --label bug --watch
```

**自动 PR 审查**:
```markdown
# HEARTBEAT.md
- [ ] 检查新 PR 的 review 评论
- [ ] 回复非技术性问题
```

### 📚 知识管理

**自动归档**:
```
把今天的对话整理成笔记
```

**跨平台同步**:
- 飞书文档自动备份
- Notion 数据库同步
- GitHub Wiki 更新

### 📱 多端协同

```
工作电脑 → OpenClaw 主实例
手机 → WhatsApp/Telegram 绑定
平板 → Web 界面访问

所有设备共享同一记忆和配置
```

---

## 融入生活

### 🏠 智能家居

```javascript
// 自定义技能：控制家居
{
  "name": "home-control",
  "trigger": ["开灯", "关灯", "调温度"],
  "action": "send_to_home_assistant"
}
```

### 📰 信息聚合

**每日简报**:
- 新闻热点
- 股票行情
- 天气预警
- 日历提醒

**一键生成**:
```markdown
# Cron 配置
{
  "schedule": {"kind": "cron", "expr": "0 8 * * *"},
  "payload": {"kind": "agentTurn", "message": "生成每日简报"}
}
```

### 🎮 娱乐场景

**电影推荐**:
```
最近有什么好看的科幻电影？
```

**游戏攻略**:
```
艾尔登法环 女武神怎么打？
```

**聊天解闷**:
```
讲个程序员笑话
```

### 💡 灵感捕捉

随时记录想法：
```
记一下：做个 AI 版的 Notion，用自然语言操作数据库
```

自动保存到 `memory/ideas/2026-03-11.md`

---

## 常见问题

### Q: 数据安全吗？

**A**: 非常安全！
- 所有数据本地存储
- 可选本地模型（Ollama 等）
- 不上传任何个人信息

### Q: 需要一直开着吗？

**A**: 建议常驻运行
- Gateway 占用资源很小（~200MB 内存）
- 可以设置开机自启
- 心跳任务需要持续运行

### Q: 模型太贵怎么办？

**A**: 多种选择
- 使用国产模型（通义、GLM）成本低
- 本地部署开源模型（免费）
- 智能路由（简单问题用小模型）

### Q: 如何备份？

```bash
# 备份工作区
tar -czf openclaw-backup-$(date +%Y%m%d).tar.gz ~/.openclaw/workspace

# 推送到 Git
cd ~/.openclaw/workspace
git add .
git commit -m "backup: $(date)"
git push
```

### Q: 出问题了怎么办？

```bash
# 查看日志
openclaw gateway logs

# 重启服务
openclaw gateway restart

# 重置配置
openclaw config reset
```

### Q: 可以多人使用吗？

**A**: 可以！
- 每个用户独立工作区
- 共享 Gateway 实例
- 通过不同 channel 区分

---

## 🚀 下一步

### 推荐学习路径

1. **第一周**: 熟悉基础功能，配置日常提醒
2. **第二周**: 尝试技能安装，定制人格
3. **第三周**: 集成工作工具（GitHub、飞书）
4. **第四周**: 开发自定义技能

### 资源链接

- **官方文档**: https://docs.openclaw.ai
- **GitHub**: https://github.com/openclaw/openclaw
- **技能市场**: https://clawhub.com
- **社区**: https://discord.gg/clawd

### 贡献代码

```bash
# Fork 项目
git clone https://github.com/openclaw/openclaw.git

# 开发功能
# ...

# 提交 PR
git push origin feature/xxx
```

---

## 💬 结语

OpenClaw 不只是一个工具，它是你的**数字分身**。

用得越久，它越懂你。

开始探索吧，有问题随时问你的 OpenClaw 助手！🐕

---

> **小提示**: 本文档本身就是用 OpenClaw 辅助创作的，从大纲到细节，全程 AI 协作。你也可以试试！
