# 本地模型部署指南

> 🖥️ 在本地运行大模型：隐私、低成本、离线可用

## 为什么选择本地部署

| 优势 | 说明 |
|------|------|
| **隐私保护** | 数据不出本地，适合敏感场景 |
| **成本可控** | 无 API 调用费用，一次性硬件投入 |
| **离线可用** | 无需网络连接，低延迟 |
| **自定义** | 可微调、可修改、可审计 |

### 适用场景

- ✅ 企业内部知识库
- ✅ 个人数据分析和处理
- ✅ 开发和测试环境
- ✅ 网络受限环境
- ❌ 需要最新模型能力
- ❌ 硬件资源有限

## 主流部署方案对比

| 方案 | 易用性 | 性能 | 支持模型 | 推荐场景 |
|------|--------|------|----------|----------|
| **Ollama** | ⭐⭐⭐⭐⭐ | ⭐⭐⭐ | Llama、Qwen、Mistral | 入门首选 |
| **LM Studio** | ⭐⭐⭐⭐⭐ | ⭐⭐⭐ | GGUF 格式模型 | 桌面用户 |
| **vLLM** | ⭐⭐⭐ | ⭐⭐⭐⭐⭐ | HuggingFace 模型 | 生产环境 |
| **Text Generation WebUI** | ⭐⭐⭐⭐ | ⭐⭐⭐⭐ | 广泛支持 | 高级用户 |
| **TensorRT-LLM** | ⭐⭐ | ⭐⭐⭐⭐⭐ | NVIDIA 优化 | 极致性能 |

## Ollama 部署（推荐入门）

### 安装

```bash
# macOS / Linux
curl -fsSL https://ollama.com/install.sh | sh

# Windows
# 下载安装包：https://ollama.com/download

# 验证安装
ollama --version
```

### 拉取模型

```bash
# 查看可用模型
ollama list

# 拉取模型
ollama pull llama3.2          # Meta Llama 3.2 (轻量)
ollama pull qwen2.5:7b        # 通义千问 2.5 7B
ollama pull gemma2:9b         # Google Gemma 2
ollama pull mistral:7b        # Mistral AI

# 拉取特定版本
ollama pull llama3.2:3b       # 3B 参数版本（更轻量）
```

### 运行模型

```bash
# 交互式对话
ollama run llama3.2

# 单次查询
ollama run llama3.2 "解释量子力学"

# 作为 API 服务
ollama serve
# 默认端口：11434
```

### API 调用示例

```python
import requests

def query_ollama(prompt: str, model: str = "llama3.2"):
    response = requests.post(
        "http://localhost:11434/api/generate",
        json={
            "model": model,
            "prompt": prompt,
            "stream": False
        }
    )
    return response.json()["response"]

# 使用示例
result = query_ollama("用 Python 写一个快速排序")
print(result)
```

### 创建自定义模型

```bash
# 创建 Modelfile
cat > Modelfile << EOF
FROM llama3.2
SYSTEM """
你是一个专业的 Python 编程助手。
请用简洁、清晰的代码回答问题。
"""
PARAMETER temperature 0.7
PARAMETER top_p 0.9
EOF

# 构建自定义模型
ollama create python-assistant -f Modelfile

# 运行
ollama run python-assistant
```

## LM Studio（桌面首选）

### 安装与使用

1. 下载安装：https://lmstudio.ai/
2. 搜索并下载模型（GGUF 格式）
3. 启动本地服务器
4. 通过 OpenAI 兼容 API 调用

### API 调用

```python
from openai import OpenAI

client = OpenAI(
    base_url="http://localhost:1234/v1",
    api_key="not-needed"  # LM Studio 不需要 API key
)

response = client.chat.completions.create(
    model="local-model",
    messages=[
        {"role": "system", "content": "你是一个助手"},
        {"role": "user", "content": "你好"}
    ]
)
print(response.choices[0].message.content)
```

## vLLM（生产环境）

### 安装

```bash
# 需要 NVIDIA GPU
pip install vllm

# 或者使用 Docker
docker run --gpus all \
  -p 8000:8000 \
  vllm/vllm-openai:latest \
  --model Qwen/Qwen2.5-7B-Instruct
```

### 启动服务

```bash
# 单 GPU
python -m vllm.entrypoints.openai.api_server \
  --model Qwen/Qwen2.5-7B-Instruct \
  --port 8000

# 多 GPU 张量并行
python -m vllm.entrypoints.openai.api_server \
  --model Qwen/Qwen2.5-7B-Instruct \
  --tensor-parallel-size 2
```

### 性能优势

```bash
# vLLM 使用 PagedAttention，吞吐量提升 2-4 倍
# 支持连续批处理（Continuous Batching）
# 支持多种采样策略
```

## 硬件要求参考

### 显存需求（FP16）

| 模型规模 | 最小显存 | 推荐显存 | 可运行 GPU |
|----------|----------|----------|------------|
| 1-3B     | 4GB      | 8GB      | RTX 3060   |
| 7B       | 8GB      | 16GB     | RTX 4070   |
| 13B      | 16GB     | 24GB     | RTX 4090   |
| 30B+     | 24GB     | 48GB+    | 多卡/云 GPU |

### 量化降低显存

| 量化级别 | 显存占用 | 精度损失 |
|----------|----------|----------|
| FP16     | 100%     | 无       |
| INT8     | 50%      | 轻微     |
| INT4     | 25%      | 可接受   |

```bash
# Ollama 自动处理量化
ollama pull llama3.2:7b-q4_K_M  # 4-bit 量化

# LM Studio 下载时选择量化版本
# 推荐：Q4_K_M 或 Q5_K_M
```

## 模型推荐

### 编程辅助

| 模型 | 大小 | 显存 | 特点 |
|------|------|------|------|
| **Qwen2.5-Coder** | 7B | 8GB | 中文友好，代码能力强 |
| **DeepSeek-Coder** | 6.7B | 8GB | 代码专用 |
| **StarCoder2** | 7B | 8GB | 多语言支持 |

### 通用对话

| 模型 | 大小 | 显存 | 特点 |
|------|------|------|------|
| **Llama 3.2** | 3B/7B | 4-8GB | 综合能力强 |
| **Qwen2.5** | 7B/14B | 8-16GB | 中文优秀 |
| **Mistral** | 7B | 8GB | 欧洲语言好 |

### 本地运行命令

```bash
# 编程助手
ollama pull qwen2.5-coder:7b

# 通用对话
ollama pull llama3.2:7b

# 中文优化
ollama pull qwen2.5:7b
```

## 集成到应用

### LangChain 集成

```python
from langchain_community.llms import Ollama
from langchain.chains import LLMChain
from langchain.prompts import PromptTemplate

# 初始化
llm = Ollama(
    model="llama3.2",
    base_url="http://localhost:11434"
)

# 创建链
prompt = PromptTemplate(
    input_variables=["question"],
    template="请详细解释：{question}"
)
chain = LLMChain(llm=llm, prompt=prompt)

# 执行
result = chain.run("什么是机器学习？")
print(result)
```

### FastAPI 服务封装

```python
from fastapi import FastAPI
from pydantic import BaseModel
import requests

app = FastAPI()

class QueryRequest(BaseModel):
    prompt: str
    model: str = "llama3.2"

@app.post("/generate")
async def generate(req: QueryRequest):
    response = requests.post(
        "http://localhost:11434/api/generate",
        json={"model": req.model, "prompt": req.prompt}
    )
    return {"result": response.json()["response"]}

# 运行：uvicorn main:app --reload
```

## 性能优化技巧

### 1. 使用量化模型

```bash
# 4-bit 量化，显存减少 75%
ollama pull llama3.2:7b-q4_K_M
```

### 2. 调整上下文长度

```bash
# Ollama 自定义参数
ollama run llama3.2 --num_ctx 2048  # 默认 4096
```

### 3. 批处理请求

```python
# 批量处理多个查询
async def batch_query(prompts: list[str]):
    tasks = [query_ollama(p) for p in prompts]
    return await asyncio.gather(*tasks)
```

### 4. 模型预热

```python
# 启动后先跑一次空请求，加载模型到显存
def warmup():
    query_ollama("hello")
```

## 故障排查

### 常见问题

```bash
# 1. 模型加载失败 - 检查显存
nvidia-smi  # 查看 GPU 状态

# 2. 响应慢 - 检查是否使用 GPU
ollama run llama3.2  # 观察加载信息

# 3. API 连接失败
curl http://localhost:11434/api/tags

# 4. 显存不足 - 使用量化版本
ollama pull llama3.2:7b-q4_K_M
```

### 日志查看

```bash
# Ollama 日志
journalctl -u ollama -f

# vLLM 日志
# 直接查看终端输出
```

## 安全建议

- 🔒 仅监听本地：`--host 127.0.0.1`
- 🔒 使用防火墙限制访问
- 🔒 生产环境添加认证层
- 🔒 定期更新模型和软件

## 下一步

- [ ] 尝试微调自己的模型
- [ ] 搭建 RAG 系统
- [ ] 部署多模型路由
- [ ] 集成监控和日志

## 参考资源

- [Ollama 官方文档](https://ollama.com/)
- [vLLM 文档](https://docs.vllm.ai/)
- [HuggingFace 模型库](https://huggingface.co/models)
- [GGUF 模型下载](https://huggingface.co/TheBloke)
