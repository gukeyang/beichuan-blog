# 技能系统

技能是 OpenClaw 的核心扩展机制，让你的助手能够执行各种任务。

## 🎯 什么是技能

技能是预定义的功能模块，让 AI 助手能够：
- 调用外部 API
- 操作文件系统
- 与第三方服务交互
- 执行自动化工作流

## 📦 内置技能

OpenClaw 自带多种实用技能：

| 技能 | 功能 | 描述 |
|------|------|------|
| `weather` | 天气查询 | 获取实时天气和预报 |
| `github` | GitHub 操作 | 管理 Issue、PR、CI |
| `notion` | Notion 集成 | 创建页面、数据库操作 |
| `gog` | Google Workspace | Gmail、Calendar、Drive |
| `feishu-*` | 飞书集成 | 文档、云盘、知识库 |
| `healthcheck` | 安全检查 | 系统安全审计 |
| `tmux` | 远程终端 | 控制 tmux 会话 |

## 🔧 使用技能

### 查看已安装技能

```bash
openclaw skills list
```

### 安装新技能

```bash
# 从 ClawHub 安装
openclaw skills install <skill-name>

# 示例
openclaw skills install weather
openclaw skills install github
```

### 启用/禁用技能

```bash
# 启用
openclaw skills enable weather

# 禁用
openclaw skills disable weather
```

### 更新技能

```bash
# 更新所有技能
openclaw skills update

# 更新特定技能
openclaw skills update weather
```

## 🏗️ 技能结构

一个典型的技能目录结构：

```
skill-name/
├── SKILL.md        # 技能描述和激活条件
├── tools/          # 工具定义
├── scripts/        # 辅助脚本
├── assets/         # 资源文件
└── README.md       # 使用说明
```

### SKILL.md 示例

```markdown
# skill-name

## 描述
简短描述技能功能

## 激活条件
什么情况下应该使用这个技能

## 工具
- tool1: 描述
- tool2: 描述

## 配置
需要的环境变量或配置项
```

## 🛠️ 创建自定义技能

### 1. 创建目录结构

```bash
mkdir -p workspace/skills/my-skill
cd workspace/skills/my-skill
```

### 2. 编写 SKILL.md

```markdown
# my-skill

## 描述
我的自定义技能

## 激活条件
当用户提到 [关键词] 时激活

## 工具
- my_tool: 执行特定任务
```

### 3. 定义工具

创建工具函数（根据技能类型）：

```javascript
// tools/my_tool.js
export async function myTool(params) {
  // 实现逻辑
  return result;
}
```

### 4. 测试技能

```bash
openclaw skills test my-skill
```

## 📚 ClawHub - 技能市场

[ClawHub](https://clawhub.com) 是 OpenClaw 的技能市场。

### 搜索技能

```bash
openclaw skills search <keyword>
```

### 发布技能

```bash
# 发布到 ClawHub
openclaw skills publish ./my-skill
```

### 技能版本管理

```bash
# 查看技能版本
openclaw skills info weather

# 安装特定版本
openclaw skills install weather@1.2.0
```

## 🔐 技能安全

### 权限控制

技能可以声明需要的权限：

```markdown
## 权限
- file:read
- file:write
- network:api
```

### 安全最佳实践

1. **最小权限原则** - 只请求必要的权限
2. **敏感操作确认** - 删除、发送消息等需要确认
3. **输入验证** - 验证所有外部输入
4. **错误处理** - 优雅处理失败情况

## 💡 实用技能组合

### 开发者工作流

```yaml
skills:
  enabled:
    - github      # 代码管理
    - notion      # 文档
    - weather     # 日常查询
    - healthcheck # 安全检查
```

### 个人助理

```yaml
skills:
  enabled:
    - gog         # Google 服务
    - notion      # 笔记
    - weather     # 天气
```

### 团队协作

```yaml
skills:
  enabled:
    - feishu-doc    # 飞书文档
    - feishu-drive  # 云盘
    - github        # 代码
    - notion        # 知识库
```

## 🐛 调试技能

### 查看技能日志

```bash
openclaw skills logs <skill-name>
```

### 技能故障排除

1. 检查 SKILL.md 格式
2. 验证工具定义
3. 查看错误日志
4. 测试独立运行

## 📖 更多资源

- [技能开发指南](https://docs.openclaw.ai/skills/developing)
- [ClawHub](https://clawhub.com)
- [示例技能库](https://github.com/openclaw/skills)
