# HTTP 协议详解

HTTP (HyperText Transfer Protocol) 超文本传输协议是互联网上应用最为广泛的一种网络协议。

## 1. 请求与响应

### 请求报文
- 请求行 (Method, URL, Version)
- 请求头 (Headers)
- 请求体 (Body)

### 响应报文
- 状态行 (Version, Status Code)
- 响应头 (Headers)
- 响应体 (Body)

## 2. 常见状态码

- **200 OK**: 请求成功
- **301 Moved Permanently**: 永久重定向
- **302 Found**: 临时重定向
- **400 Bad Request**: 请求参数错误
- **401 Unauthorized**: 未授权
- **403 Forbidden**: 禁止访问
- **404 Not Found**: 资源不存在
- **500 Internal Server Error**: 服务器内部错误
- **502 Bad Gateway**: 网关错误

## 3. HTTPS

HTTPS = HTTP + SSL/TLS，通过加密传输保障数据安全。
