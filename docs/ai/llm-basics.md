# 大模型基础概念

## 一、什么是大语言模型（LLM）

**大语言模型（Large Language Model）** 是基于深度学习技术，在海量文本数据上训练的自然语言处理模型。

### 1.1 核心特点

- **规模大**：参数量从几十亿到上万亿
- **通用性强**：可处理多种任务（问答、写作、编程等）
- **涌现能力**：参数达到一定规模后出现新能力

### 1.2 主流模型对比

| 模型 | 厂商 | 特点 | 适用场景 |
|------|------|------|----------|
| GPT-4/4o | OpenAI | 综合能力最强 | 通用任务 |
| Claude 3.5 | Anthropic | 长上下文、安全性好 | 文档分析、代码 |
| Qwen2.5 | 阿里 | 中文能力强、开源 | 中文应用 |
| GLM-4 | 智谱 AI | 中文优化、性价比高 | 国内应用 |
| Llama 3 | Meta | 开源、可本地部署 | 私有化部署 |

## 二、核心概念

### 2.1 Token

**Token 是模型处理文本的基本单位。**

```
中文：1 个汉字 ≈ 1.5 个 Token
英文：1 个单词 ≈ 1.3 个 Token
代码：1 行代码 ≈ 5-10 个 Token
```

**计费示例：**
```
输入：1000 Tokens
输出：500 Tokens
总计：1500 Tokens

GPT-4: $0.03/1K input + $0.06/1K output = $0.045
```

### 2.2 上下文窗口（Context Window）

模型一次能处理的**最大 Token 数**：

| 模型 | 上下文长度 |
|------|------------|
| GPT-4 Turbo | 128K |
| Claude 3.5 | 200K |
| Qwen2.5 | 256K |
| GLM-4 | 128K |

**实际意义：**
- 128K ≈ 10 万汉字 ≈ 100 篇长文章
- 支持长文档分析、多轮对话

### 2.3 Temperature（温度）

控制输出的**随机性**：

```python
# Temperature = 0：确定性输出
"1+1=" → "2"

# Temperature = 0.7：平衡（默认）
"写一首诗" → 有一定创意但合理

# Temperature = 1.5：高度随机
"写一首诗" → 可能胡言乱语
```

**推荐设置：**
- 事实性问题：0 - 0.3
- 创意写作：0.7 - 0.9
- 代码生成：0.2 - 0.5

### 2.4 Top-P（核采样）

控制候选词的选择范围：

```
Top-P = 0.9：从累积概率 90% 的词中采样
Top-P = 1.0：全部候选词（不推荐）
```

通常与 Temperature 配合使用，**只调整一个即可**。

## 三、模型工作原理

### 3.1 Transformer 架构

```
输入 → Embedding → 多层 Transformer → 输出概率 → 采样 → Token
              ↓
          Self-Attention（自注意力机制）
```

**核心思想：** 每个词关注句子中其他词，理解上下文关系。

### 3.2 训练过程

```
1. 预训练（Pre-training）
   - 海量文本数据
   - 学习语言规律
   - 成本最高（数百万美元）

2. 指令微调（Instruction Tuning）
   - 高质量问答数据
   - 学习遵循指令
   - 成本较低

3. 人类对齐（RLHF）
   - 人类反馈强化学习
   - 使输出更符合人类偏好
   - 提升安全性和有用性
```

### 3.3 推理过程

```
用户输入 → Tokenization → 模型推理 → 生成 Token → Detokenization → 输出
           (分词)                                      (解码)
```

**自回归生成：** 每次生成一个 Token，作为下一次输入的一部分。

## 四、API 调用基础

### 4.1 OpenAI 格式

```python
from openai import OpenAI

client = OpenAI(api_key="your-api-key")

response = client.chat.completions.create(
    model="gpt-4o",
    messages=[
        {"role": "system", "content": "你是一个专业助手"},
        {"role": "user", "content": "你好，请介绍一下自己"}
    ],
    temperature=0.7,
    max_tokens=1000
)

print(response.choices[0].message.content)
```

### 4.2 消息角色

| 角色 | 用途 | 示例 |
|------|------|------|
| system | 设定系统行为 | "你是一个专业翻译" |
| user | 用户输入 | "翻译这句话..." |
| assistant | 模型回复 | "好的，翻译如下..." |

### 4.3 流式输出

```python
stream = client.chat.completions.create(
    model="gpt-4o",
    messages=messages,
    stream=True  # 开启流式
)

for chunk in stream:
    if chunk.choices[0].delta.content:
        print(chunk.choices[0].delta.content, end="", flush=True)
```

**优点：** 降低首字延迟，用户体验更好

## 五、成本优化

### 5.1 选择合适的模型

```
简单任务（分类、提取） → 小模型（GPT-3.5, Qwen-Turbo）
复杂推理 → 大模型（GPT-4, Claude）
批量处理 → 本地部署（Llama, Qwen）
```

### 5.2 Prompt 优化

```
❌ 冗长：请帮我分析一下这篇文章的主要内容，包括作者想表达的核心观点...
✅ 简洁：总结文章核心观点（200 字内）
```

### 5.3 缓存复用

```python
# 相同输入返回相同输出
cache_key = hash(prompt)
if cache_key in cache:
    return cache[cache_key]
```

## 六、安全与限制

### 6.1 常见限制

- **内容安全**：不涉及违法、暴力、色情内容
- **隐私保护**：不处理个人敏感信息
- **知识截止**：模型知识有截止日期（如 GPT-4 截止 2024.04）

### 6.2 越狱风险

避免尝试绕过安全限制，可能导致：
- API 账号被封
- 输出不可控内容
- 法律风险

---

**相关文档：**
- [Prompt Engineering 实战](/ai/prompt-engineering)
- [RAG 系统搭建](/ai/rag-implementation)
