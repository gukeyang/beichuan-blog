# RAG 系统实战

## 一、什么是 RAG

**RAG（Retrieval-Augmented Generation，检索增强生成）** 结合检索和生成的优势：

```
用户问题 → 检索相关知识 → 拼接 Prompt → LLM 生成 → 带依据的回答
```

**为什么需要 RAG？**
- 解决模型知识截止问题
- 减少幻觉（Hallucination）
- 支持私有数据查询
- 可追溯回答来源

## 二、系统架构

```
┌─────────────────────────────────────────────────────────┐
│                      RAG System                          │
├─────────────────────────────────────────────────────────┤
│                                                          │
│  知识库 → 文档加载 → 文本分块 → 向量化 → 向量数据库    │
│     ↑                                      ↓            │
│     │                              相似度检索            │
│     │                                      ↓            │
│  更新索引                            拼接 Prompt         │
│                                          ↓               │
│  用户问题 ───────────────────────→ LLM → 回答          │
│                                                          │
└─────────────────────────────────────────────────────────┘
```

## 三、核心组件

### 3.1 文档加载

```python
from langchain.document_loaders import (
    PyPDFLoader,      # PDF
    TextLoader,       # TXT
    Docx2txtLoader,   # Word
    UnstructuredMarkdownLoader,  # Markdown
    WebBaseLoader      # 网页
)

# 示例：加载 PDF
loader = PyPDFLoader("product_manual.pdf")
documents = loader.load()
```

### 3.2 文本分块（Chunking）

**为什么分块？**
- 模型上下文有限
- 检索更精确
- 减少无关信息

**分块策略：**

```python
from langchain.text_splitter import (
    RecursiveCharacterTextSplitter,
    CharacterTextSplitter
)

# 推荐：递归分块（按段落、句子分割）
text_splitter = RecursiveCharacterTextSplitter(
    chunk_size=500,        # 每块 500 tokens
    chunk_overlap=50,      # 重叠 50 tokens（保持上下文）
    separators=["\n\n", "\n", "。", "！", "？", " ", ""]
)

chunks = text_splitter.split_documents(documents)
```

**分块大小建议：**
| 场景 | chunk_size | chunk_overlap |
|------|------------|---------------|
| 通用问答 | 500-800 | 50-100 |
| 代码检索 | 300-500 | 30-50 |
| 长文档分析 | 800-1000 | 100-200 |

### 3.3 向量化（Embedding）

```python
from langchain.embeddings import HuggingFaceEmbeddings
from langchain_openai import OpenAIEmbeddings

# 方案 1：OpenAI（效果好，付费）
embeddings = OpenAIEmbeddings(model="text-embedding-3-small")

# 方案 2：本地模型（免费，需 GPU）
embeddings = HuggingFaceEmbeddings(
    model_name="BAAI/bge-large-zh-v1.5",  # 中文效果好
    model_kwargs={"device": "cuda"},
    encode_kwargs={"normalize_embeddings": True}
)

# 生成向量
vector = embeddings.embed_query("什么是 RAG？")
print(len(vector))  # 1024 维
```

**常用 Embedding 模型：**
| 模型 | 维度 | 特点 |
|------|------|------|
| text-embedding-3-small | 1536 | OpenAI，性价比高 |
| text-embedding-3-large | 3072 | OpenAI，效果最好 |
| bge-large-zh-v1.5 | 1024 | 中文优化，开源 |
| m3e-base | 768 | 中文，轻量 |

### 3.4 向量数据库

```python
# 方案 1：Chroma（轻量，适合开发）
from langchain.vectorstores import Chroma

vectorstore = Chroma.from_documents(
    documents=chunks,
    embedding=embeddings,
    persist_directory="./chroma_db"
)

# 方案 2：Milvus（生产级，高性能）
from langchain.vectorstores import Milvus

vectorstore = Milvus.from_documents(
    documents=chunks,
    embedding=embeddings,
    connection_args={"host": "localhost", "port": 19530}
)

# 方案 3：pgvector（PostgreSQL 扩展）
from langchain.vectorstores import PGVector

vectorstore = PGVector.from_documents(
    documents=chunks,
    embedding=embeddings,
    connection_string="postgresql://user:pass@localhost:5432/db"
)
```

## 四、检索策略

### 4.1 相似度检索

```python
# 基础相似度检索
results = vectorstore.similarity_search(
    query="如何退货？",
    k=3  # 返回最相关的 3 条
)

# 带分数的检索
results = vectorstore.similarity_search_with_score(
    query="如何退货？",
    k=3
)

for doc, score in results:
    print(f"相似度：{1 - score:.2f}")  # 越接近 0 越相似
    print(doc.page_content[:100])
```

### 4.2 MMR（最大边际相关性）

平衡**相关性**和**多样性**：

```python
results = vectorstore.max_marginal_relevance_search(
    query="退货政策",
    k=3,
    fetch_k=10,  # 先取 10 条
    lambda_mult=0.5  # 0=只考虑多样性，1=只考虑相关性
)
```

### 4.3 混合检索（Hybrid Search）

结合**向量检索**和**关键词检索**：

```python
from langchain.retrievers import EnsembleRetriever
from langchain_community.retrievers import BM25Retriever

# 向量检索
vector_retriever = vectorstore.as_retriever(search_kwargs={"k": 3})

# 关键词检索（BM25）
bm25_retriever = BM25Retriever.from_documents(chunks)
bm25_retriever.k = 3

# 混合
ensemble_retriever = EnsembleRetriever(
    retrievers=[vector_retriever, bm25_retriever],
    weights=[0.7, 0.3]  # 权重
)

results = ensemble_retriever.invoke("退货政策")
```

## 五、完整实现

### 5.1 基础 RAG

```python
from langchain.chains import RetrievalQA
from langchain.llms import OpenAI

# 创建检索器
retriever = vectorstore.as_retriever(search_kwargs={"k": 3})

# 创建 QA 链
qa_chain = RetrievalQA.from_chain_type(
    llm=OpenAI(model="gpt-4o"),
    chain_type="stuff",  # 将所有文档拼接到 prompt
    retriever=retriever,
    return_source_documents=True
)

# 查询
response = qa_chain({"query": "如何申请退货？"})

print(response["result"])
print("来源：", response["source_documents"])
```

### 5.2 自定义 Prompt

```python
from langchain.prompts import PromptTemplate

template = """你是一名专业客服助手，基于以下上下文回答问题。
如果上下文中没有答案，请明确告知，不要编造。

上下文：
{context}

问题：{question}

回答要求：
1. 直接回答问题
2. 引用相关条款
3. 如有必要，提供操作步骤
4. 不确定时建议联系人工客服

回答："""

prompt = PromptTemplate(
    template=template,
    input_variables=["context", "question"]
)

qa_chain = RetrievalQA.from_chain_type(
    llm=OpenAI(model="gpt-4o"),
    chain_type="stuff",
    retriever=retriever,
    chain_type_kwargs={"prompt": prompt}
)
```

### 5.3 多轮对话

```python
from langchain.chains import ConversationalRetrievalChain
from langchain.memory import ConversationBufferMemory

memory = ConversationBufferMemory(
    memory_key="chat_history",
    return_messages=True
)

conversational_chain = ConversationalRetrievalChain.from_llm(
    llm=OpenAI(model="gpt-4o"),
    retriever=retriever,
    memory=memory,
    return_source_documents=True
)

# 多轮对话
chat_history = []
while True:
    query = input("用户：")
    result = conversational_chain({"question": query, "chat_history": chat_history})
    print("助手：", result["answer"])
    chat_history.append((query, result["answer"]))
```

## 六、优化技巧

### 6.1 查询重写

```python
# 将用户问题改写为更适合检索的形式
def rewrite_query(query):
    prompt = f"""将以下问题改写为更适合检索的关键词形式：
    原问题：{query}
    改写后："""
    return llm.invoke(prompt)

# 示例
"我买的商品有问题怎么退？" → "退货流程 商品质量问题"
```

### 6.2 元数据过滤

```python
# 文档加载时添加元数据
for doc in documents:
    doc.metadata["category"] = "售后"
    doc.metadata["version"] = "2024"

# 检索时过滤
retriever = vectorstore.as_retriever(
    search_kwargs={
        "k": 3,
        "filter": {"category": "售后", "version": "2024"}
    }
)
```

### 6.3 缓存优化

```python
from langchain.cache import SQLiteCache
from langchain.globals import set_llm_cache

# 启用缓存（相同 query 直接返回）
set_llm_cache(SQLiteCache(database_path=".langchain.db"))
```

## 七、评估指标

| 指标 | 说明 | 评估方法 |
|------|------|----------|
| 检索准确率 | 检索到的文档是否相关 | 人工标注/相关性评分 |
| 回答准确率 | 回答是否正确 | 对比标准答案 |
| 响应时间 | 端到端延迟 | 性能测试 |
| 覆盖率 | 能回答的问题比例 | 测试集统计 |

---

**相关文档：**
- [Agent 开发指南](/ai/agent-development)
- [本地模型部署](/ai/local-model-deployment)
