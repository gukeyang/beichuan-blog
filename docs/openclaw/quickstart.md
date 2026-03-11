# OpenClaw 快速开始

5 分钟创建你的第一个 AI 助手。

## 前置条件

确保已安装 OpenClaw，参考 [安装指南](/openclaw/install)。

## Step 1: 启动 Gateway

```bash
openclaw gateway start
```

## Step 2: 访问 Web Chat

打开浏览器访问：http://localhost:3000

## Step 3: 测试对话

在聊天框中输入：

```
你好，介绍一下你自己
```

## Step 4: 创建第一个 Skill

创建文件 `skills/hello/SKILL.md`:

```markdown
# Hello Skill

简单的问候技能。

## 触发

用户说"你好"、"hello"、"hi"

## 响应

回复问候语
```

## Step 5: 使用工具

### 读取文件

```
读取 README.md 的内容
```

### 执行命令

```
运行 ls -la 查看当前目录
```

### 搜索网络

```
搜索最新的 AI 新闻
```

## Step 6: 配置模型

编辑 `~/.openclaw/config.json`:

```json
{
  "model": {
    "provider": "dashscope",
    "apiKey": "YOUR_API_KEY",
    "default": "qwen-max"
  }
}
```

然后重启：

```bash
openclaw gateway restart
```

## 下一步

- [Skills 系统](/openclaw/skills) - 学习创建自定义技能
- [高级用法](/openclaw/advanced) - 探索更多功能

## 资源

- [官方文档](https://docs.openclaw.ai)
- [Skill 市场](https://clawhub.com)
