# OpenClaw Skills 系统

Skills 是 OpenClaw 的核心扩展机制。

## 什么是 Skills？

Skills 是可插拔的功能模块，让 AI 助手能够：
- 执行特定任务
- 访问外部 API
- 操作文件和系统
- 与第三方服务集成

## Skill 结构

```
my-skill/
├── SKILL.md        # 技能描述和指令
├── package.json    # 依赖配置（可选）
├── scripts/        # 脚本文件（可选）
│   └── run.sh
└── references/     # 参考资料（可选）
    └── doc.md
```

## SKILL.md 格式

```markdown
# Skill 名称

技能描述。

## 触发条件

描述何时激活此技能。

## 执行步骤

1. 第一步
2. 第二步
3. ...

## 工具使用

列出使用的工具和参数。

## 示例

用户：示例请求
助手：示例响应
```

## 内置 Skills

### 文件系统

- `read`: 读取文件
- `write`: 写入文件
- `edit`: 编辑文件
- `exec`: 执行命令

### 网络

- `browser`: 浏览器控制
- `message`: 消息发送

### 系统

- `gateway`: Gateway 管理
- `cron`: 定时任务
- `sessions`: 会话管理

## 创建自定义 Skill

### 示例：天气查询

创建 `skills/weather/SKILL.md`:

```markdown
# Weather Skill

查询天气信息。

## 触发

用户询问天气、温度、预报

## 执行

1. 提取地点
2. 调用天气 API
3. 格式化结果

## API

使用 wttr.in 或 Open-Meteo
```

## 安装 Skills

### 从 Clawhub

```bash
clawhub install skill-name
```

### 手动安装

```bash
# 复制 skill 目录到 ~/.openclaw/workspace/skills/
cp -r my-skill ~/.openclaw/workspace/skills/

# 重启 Gateway
openclaw gateway restart
```

## Skill 最佳实践

1. **单一职责**: 每个 Skill 只做一件事
2. **清晰文档**: 写好 SKILL.md
3. **错误处理**: 处理边界情况
4. **测试**: 验证各种场景

## 相关文档

- [快速开始](/openclaw/quickstart)
- [高级用法](/openclaw/advanced)

## 资源

- [Clawhub](https://clawhub.com) - Skill 市场
- [官方文档](https://docs.openclaw.ai)
