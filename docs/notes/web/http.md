# HTTP 协议

HTTP（HyperText Transfer Protocol）超文本传输协议是 Web 开发的基础。

## HTTP 基础

### 请求方法

- **GET**: 获取资源
- **POST**: 提交数据
- **PUT**: 更新资源
- **DELETE**: 删除资源
- **PATCH**: 部分更新
- **HEAD**: 获取响应头
- **OPTIONS**: 获取支持的方法

### 状态码

- **1xx**: 信息性响应
- **2xx**: 成功（200 OK, 201 Created）
- **3xx**: 重定向（301, 302, 304）
- **4xx**: 客户端错误（400, 401, 403, 404）
- **5xx**: 服务器错误（500, 502, 503）

## HTTP/1.1 vs HTTP/2

| 特性 | HTTP/1.1 | HTTP/2 |
|------|----------|--------|
| 连接方式 | 文本协议 | 二进制协议 |
| 多路复用 | ❌ 队头阻塞 | ✅ 支持 |
| 头部压缩 | ❌ | ✅ HPACK |
| 服务器推送 | ❌ | ✅ 支持 |

## 相关文档

- [HTTP vs HTTPS](/notes/network/http-vs-https)
- [TCP 三次握手](/notes/network/tcp-handshake)
