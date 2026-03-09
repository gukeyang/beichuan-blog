# Agent 开发实战

> 🤖 构建智能体：从理论到实践

## 什么是 AI Agent

AI Agent（智能体）是能够感知环境、进行决策并执行动作的智能系统。它不仅仅是回答问题，还能**自主完成任务**。

### 核心组成

```
┌─────────────────────────────────────────────────────┐
│                    AI Agent                          │
├─────────────────────────────────────────────────────┤
│  ┌──────────┐  ┌──────────┐  ┌──────────┐          │
│  │ 感知层   │  │ 决策层   │  │ 执行层   │          │
│  │ Perception│  │ Planning │  │ Action   │          │
│  └──────────┘  └──────────┘  └──────────┘          │
│         ▲              │              │              │
│         └──────────────┴──────────────┘              │
│                    记忆系统 Memory                     │
└─────────────────────────────────────────────────────┘
```

### Agent 与 Chatbot 的区别

| 特性 | Chatbot | Agent |
|------|---------|-------|
| 目标 | 回答问题 | 完成任务 |
| 能力 | 单轮/多轮对话 | 规划、工具调用、记忆 |
| 自主性 | 被动响应 | 主动执行 |
| 复杂度 | 低 | 高 |

## Agent 架构设计

### ReAct 模式

ReAct（Reasoning + Acting）是最经典的 Agent 架构：

```python
# ReAct 伪代码示例
def react_agent(task: str) -> str:
    thought = llm.generate(f"思考：{task}")
    action = llm.generate(f"行动：{thought}")
    observation = execute_action(action)
    return llm.generate(f"回答：{observation}")
```

### 核心组件

#### 1. 规划模块（Planning）

- **任务分解**：将复杂任务拆分为可执行的子任务
- **反思机制**：评估执行结果，调整策略

```markdown
示例：规划一次旅行

原始任务："帮我规划北京 3 日游"

分解后：
1. 查询北京天气
2. 推荐热门景点
3. 规划每日路线
4. 预订酒店和餐厅
```

#### 2. 记忆系统（Memory）

| 类型 | 描述 | 实现方式 |
|------|------|----------|
| 短期记忆 | 当前对话上下文 | Context Window |
| 长期记忆 | 历史经验和知识 | 向量数据库 |
| 程序记忆 | 技能和工具使用 | Function Registry |

#### 3. 工具使用（Tool Use）

```typescript
// 工具定义示例
const tools = [
  {
    name: 'search',
    description: '搜索互联网信息',
    parameters: { query: 'string' }
  },
  {
    name: 'calculator',
    description: '执行数学计算',
    parameters: { expression: 'string' }
  },
  {
    name: 'database',
    description: '查询数据库',
    parameters: { sql: 'string' }
  }
]
```

## 实战：构建一个客服 Agent

### 技术栈选择

- **框架**：LangChain
- **模型**：GPT-4 / Qwen-Max
- **向量库**：Chroma
- **部署**：FastAPI + Docker

### 项目结构

```
customer-service-agent/
├── src/
│   ├── agent/
│   │   ├── __init__.py
│   │   ├── planner.py      # 规划模块
│   │   ├── memory.py       # 记忆管理
│   │   └── executor.py     # 执行引擎
│   ├── tools/
│   │   ├── knowledge_base.py  # 知识库查询
│   │   ├── order_system.py    # 订单系统
│   │   └── sentiment.py       # 情感分析
│   └── config.py
├── tests/
├── requirements.txt
└── docker-compose.yml
```

### 核心代码

```python
# agent/executor.py
from langchain.agents import AgentExecutor, create_openai_functions_agent
from langchain.memory import ConversationBufferMemory
from langchain.vectorstores import Chroma

class CustomerServiceAgent:
    def __init__(self, model: str = "gpt-4"):
        self.llm = ChatOpenAI(model=model, temperature=0.7)
        self.memory = ConversationBufferMemory(
            memory_key="chat_history",
            return_messages=True
        )
        self.vectorstore = Chroma(
            embedding_function=OpenAIEmbeddings(),
            persist_directory="./knowledge_base"
        )
        
    def create_agent(self):
        tools = self._load_tools()
        prompt = ChatPromptTemplate.from_template("""
        你是一个专业的客服助手。请根据以下信息回答用户问题：
        
        知识库信息：{context}
        对话历史：{chat_history}
        用户问题：{input}
        
        请提供准确、友好的回答。
        """)
        
        agent = create_openai_functions_agent(self.llm, tools, prompt)
        return AgentExecutor(
            agent=agent,
            tools=tools,
            memory=self.memory,
            verbose=True
        )
    
    def _load_tools(self):
        return [
            KnowledgeBaseTool(self.vectorstore),
            OrderLookupTool(),
            SentimentAnalysisTool()
        ]
```

### 知识库构建

```python
# 构建产品知识库
from langchain.text_splitter import RecursiveCharacterTextSplitter
from langchain.embeddings import OpenAIEmbeddings

def build_knowledge_base(products: list[dict]):
    text_splitter = RecursiveCharacterTextSplitter(
        chunk_size=500,
        chunk_overlap=50
    )
    
    documents = []
    for product in products:
        text = f"""
        产品名称：{product['name']}
        价格：{product['price']}
        描述：{product['description']}
        常见问题：{product['faq']}
        """
        docs = text_splitter.create_documents([text])
        documents.extend(docs)
    
    vectorstore = Chroma.from_documents(
        documents=documents,
        embedding=OpenAIEmbeddings()
    )
    vectorstore.persist()
    return vectorstore
```

## 高级技巧

### 1. 多 Agent 协作

复杂任务可以由多个 specialized agents 协作完成：

```
┌─────────────┐
│  Coordinator│ (协调者)
└──────┬──────┘
       │
   ┌───┴───┬───────────┬───────────┐
   ▼       ▼           ▼           ▼
┌─────┐ ┌─────┐   ┌─────────┐ ┌─────────┐
│研究 │ │写作 │   │ 代码审查│ │ 测试    │
│Agent│ │Agent│   │ Agent   │ │ Agent   │
└─────┘ └─────┘   └─────────┘ └─────────┘
```

### 2. 自我反思

```python
def self_reflection(agent, task: str, result: str) -> str:
    reflection = agent.llm.invoke(f"""
    任务：{task}
    结果：{result}
    
    请评估：
    1. 结果是否满足任务要求？
    2. 有哪些可以改进的地方？
    3. 是否需要重新执行某些步骤？
    """)
    return reflection
```

### 3. 人类反馈（HITL）

对于敏感操作，引入人工审核：

```python
def execute_with_approval(action: str):
    if action.risk_level == "high":
        approval = human_review(action)
        if not approval:
            return "操作已被拒绝"
    return execute_action(action)
```

## 常见陷阱与解决方案

| 问题 | 原因 | 解决方案 |
|------|------|----------|
| 无限循环 | Agent 重复执行相同动作 | 添加执行历史检查 |
| 工具调用失败 | 参数格式错误 | 强化参数验证 |
| 上下文溢出 | 对话历史过长 | 实现记忆压缩 |
| 响应延迟 | 多步执行耗时 | 异步执行 + 流式输出 |

## 性能优化

### 缓存策略

```python
from functools import lru_cache
import hashlib

@lru_cache(maxsize=1000)
def cached_llm_call(prompt_hash: str) -> str:
    # 缓存 LLM 响应
    pass

def generate_response(prompt: str) -> str:
    prompt_hash = hashlib.md5(prompt.encode()).hexdigest()
    if prompt_hash in cache:
        return cache[prompt_hash]
    return cached_llm_call(prompt_hash)
```

### 批量处理

```python
# 批量处理多个请求
async def batch_process(tasks: list[str], batch_size: int = 5):
    for i in range(0, len(tasks), batch_size):
        batch = tasks[i:i+batch_size]
        results = await asyncio.gather(*[process(t) for t in batch])
        yield results
```

## 部署与监控

### Docker 部署

```dockerfile
FROM python:3.11-slim

WORKDIR /app
COPY requirements.txt .
RUN pip install -r requirements.txt

COPY . .
EXPOSE 8000

CMD ["uvicorn", "main:app", "--host", "0.0.0.0", "--port", "8000"]
```

### 监控指标

- **响应时间**：P95 < 2s
- **成功率**：> 99%
- **Token 使用量**：监控成本
- **用户满意度**：收集反馈评分

## 下一步

- [ ] 实现多 Agent 协作系统
- [ ] 集成更多外部工具
- [ ] 优化记忆压缩算法
- [ ] 添加 A/B 测试框架

## 参考资源

- [LangChain Agents 文档](https://python.langchain.com/docs/modules/agents/)
- [ReAct Paper](https://arxiv.org/abs/2210.03629)
- [AutoGen 框架](https://microsoft.github.io/autogen/)
