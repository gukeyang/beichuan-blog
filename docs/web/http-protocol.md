# HTTP 协议详解

> 🌐 从 HTTP/1.1 到 HTTP/2，理解 Web 通信的基石

## HTTP 发展史

| 版本 | 年份 | 主要特性 |
|------|------|----------|
| HTTP/0.9 | 1991 | 仅支持 GET，无头部 |
| HTTP/1.0 | 1996 | 支持 GET/POST/HEAD，引入头部 |
| HTTP/1.1 | 1997 | 持久连接、管道化、Host 头 |
| HTTP/2 | 2015 | 多路复用、头部压缩、服务器推送 |
| HTTP/3 | 2022 | 基于 QUIC，UDP 传输 |

## HTTP 请求报文

```
GET /api/users/123 HTTP/1.1
Host: api.example.com
User-Agent: Mozilla/5.0
Accept: application/json
Authorization: Bearer eyJhbGc...
```

### 请求方法

| 方法 | 用途 | 幂等 | 安全 |
|------|------|------|------|
| GET | 获取资源 | ✅ | ✅ |
| POST | 创建资源 | ❌ | ❌ |
| PUT | 更新资源（全量） | ✅ | ❌ |
| PATCH | 更新资源（部分） | ❌ | ❌ |
| DELETE | 删除资源 | ✅ | ❌ |
| HEAD | 获取响应头 | ✅ | ✅ |
| OPTIONS | 获取支持的方法 | ✅ | ✅ |

### 常见请求头

```http
# 认证
Authorization: Bearer <token>
Cookie: session=abc123

# 内容协商
Accept: application/json
Accept-Language: zh-CN,zh
Accept-Encoding: gzip, deflate

# 缓存控制
Cache-Control: no-cache
If-Modified-Since: Wed, 21 Oct 2024 07:28:00 GMT

# 其他
Host: api.example.com
User-Agent: Mozilla/5.0
Referer: https://example.com/
```

## HTTP 响应报文

```
HTTP/1.1 200 OK
Content-Type: application/json
Content-Length: 1234
Cache-Control: max-age=3600
Set-Cookie: session=xyz789; HttpOnly; Secure

{"id": 123, "name": "John"}
```

### 状态码分类

| 分类 | 范围 | 说明 |
|------|------|------|
| 1xx | 100-199 | 信息性响应 |
| 2xx | 200-299 | 成功 |
| 3xx | 300-399 | 重定向 |
| 4xx | 400-499 | 客户端错误 |
| 5xx | 500-599 | 服务端错误 |

### 常用状态码

| 状态码 | 含义 | 场景 |
|--------|------|------|
| 200 OK | 成功 | 请求成功 |
| 201 Created | 已创建 | POST 成功创建资源 |
| 204 No Content | 无内容 | DELETE 成功 |
| 301 Moved Permanently | 永久重定向 | URL 变更 |
| 302 Found | 临时重定向 | 临时跳转 |
| 304 Not Modified | 未修改 | 缓存命中 |
| 400 Bad Request | 错误请求 | 参数错误 |
| 401 Unauthorized | 未授权 | 未登录 |
| 403 Forbidden | 禁止访问 | 无权限 |
| 404 Not Found | 未找到 | 资源不存在 |
| 409 Conflict | 冲突 | 资源已存在 |
| 422 Unprocessable Entity | 无法处理 | 参数验证失败 |
| 429 Too Many Requests | 请求过多 | 限流 |
| 500 Internal Server Error | 服务器错误 | 代码异常 |
| 502 Bad Gateway | 网关错误 | 上游服务失败 |
| 503 Service Unavailable | 服务不可用 | 过载/维护 |

## HTTPS 加密原理

```
客户端                    服务端
   │                        │
   │   ClientHello          │
   │   (支持的加密套件)      │
   │───────────────────────>│
   │                        │
   │   ServerHello          │
   │   (选定的加密套件)      │
   │   Certificate          │
   │   (公钥证书)            │
   │<───────────────────────│
   │                        │
   │   ClientKeyExchange    │
   │   (加密的预主密钥)      │
   │───────────────────────>│
   │                        │
   │   双方生成会话密钥      │
   │   开始加密通信          │
```

### HTTPS 优势

- ✅ 数据加密，防止窃听
- ✅ 身份认证，防止冒充
- ✅ 数据完整性，防止篡改

## HTTP/2 新特性

### 1. 多路复用（Multiplexing）

```
HTTP/1.1: 队头阻塞
请求 1: [======]
请求 2:        [======]
请求 3:               [======]

HTTP/2: 多路复用
请求 1: [==]  [==]    [==]
请求 2:   [==]    [==]
请求 3:     [==]    [==]
时间：  1   2   3   4
```

### 2. 头部压缩（HPACK）

```
# HTTP/1.1 重复传输相同头部
GET /api/users HTTP/1.1
Host: api.example.com
User-Agent: Mozilla/5.0
Accept: application/json

GET /api/posts HTTP/1.1
Host: api.example.com        ← 重复
User-Agent: Mozilla/5.0      ← 重复
Accept: application/json     ← 重复

# HTTP/2: 使用 HPACK 压缩，只传输差异
```

### 3. 服务器推送（Server Push）

```
客户端请求：GET /index.html

服务器推送:
  Push: /styles/main.css
  Push: /scripts/app.js
  Push: /images/logo.png

响应：index.html + 所有资源
```

## 缓存机制

### 缓存控制头

```http
# 强缓存
Cache-Control: max-age=3600          # 缓存 1 小时
Cache-Control: no-cache              # 需验证
Cache-Control: no-store              # 不缓存

# 协商缓存
ETag: "abc123"
Last-Modified: Wed, 21 Oct 2024 07:28:00 GMT

# 客户端请求
If-None-Match: "abc123"
If-Modified-Since: Wed, 21 Oct 2024 07:28:00 GMT
```

### 缓存流程

```
         有缓存？
           │
    ┌──────┴──────┐
    │             │
   是            否
    │             │
    ▼             ▼
强缓存过期？  直接请求
    │
 ┌──┴──┐
 │     │
是     否
│     │
▼     ▼
协商  使用缓存
│
▼
304/200
```

## 跨域问题（CORS）

### 简单请求

```http
# 客户端
Origin: https://frontend.com

# 服务端
Access-Control-Allow-Origin: https://frontend.com
Access-Control-Allow-Methods: GET, POST
Access-Control-Allow-Headers: Content-Type
```

### 预检请求（OPTIONS）

```http
# 客户端 - 预检
OPTIONS /api/users HTTP/1.1
Origin: https://frontend.com
Access-Control-Request-Method: POST
Access-Control-Request-Headers: Content-Type, Authorization

# 服务端 - 预检响应
HTTP/1.1 204 No Content
Access-Control-Allow-Origin: https://frontend.com
Access-Control-Allow-Methods: POST, GET
Access-Control-Allow-Headers: Content-Type, Authorization
Access-Control-Max-Age: 86400
```

## 实战：Spring Boot 中的 HTTP

### RESTful Controller

```java
@RestController
@RequestMapping("/api/users")
public class UserController {
    
    @GetMapping("/{id}")
    public ResponseEntity<User> getUser(@PathVariable Long id) {
        return userRepository.findById(id)
            .map(ResponseEntity::ok)
            .orElse(ResponseEntity.notFound().build());
    }
    
    @PostMapping
    public ResponseEntity<User> createUser(@Valid @RequestBody UserCreateRequest req) {
        User user = userService.create(req);
        URI location = URI.create("/api/users/" + user.getId());
        return ResponseEntity.created(location).body(user);
    }
    
    @PutMapping("/{id}")
    public ResponseEntity<User> updateUser(
            @PathVariable Long id,
            @Valid @RequestBody UserUpdateRequest req) {
        return ResponseEntity.ok(userService.update(id, req));
    }
    
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteUser(@PathVariable Long id) {
        userService.delete(id);
        return ResponseEntity.noContent().build();
    }
}
```

### 全局异常处理

```java
@RestControllerAdvice
public class GlobalExceptionHandler {
    
    @ExceptionHandler(ResourceNotFoundException.class)
    public ResponseEntity<ErrorResponse> handleNotFound(ResourceNotFoundException e) {
        ErrorResponse error = new ErrorResponse(404, e.getMessage());
        return ResponseEntity.status(404).body(error);
    }
    
    @ExceptionHandler(MethodArgumentNotValidException.class)
    public ResponseEntity<ErrorResponse> handleValidation(
            MethodArgumentNotValidException e) {
        List<FieldError> errors = e.getBindingResult()
            .getFieldErrors()
            .stream()
            .map(err -> new FieldError(err.getField(), err.getDefaultMessage()))
            .collect(Collectors.toList());
        
        ErrorResponse error = new ErrorResponse(422, "参数验证失败", errors);
        return ResponseEntity.status(422).body(error);
    }
    
    @ExceptionHandler(Exception.class)
    public ResponseEntity<ErrorResponse> handleGeneric(Exception e) {
        ErrorResponse error = new ErrorResponse(500, "服务器内部错误");
        return ResponseEntity.status(500).body(error);
    }
}
```

### 统一响应格式

```java
@Data
@AllArgsConstructor
public class ErrorResponse {
    private int status;
    private String message;
    private List<FieldError> errors;
    
    @Data
    @AllArgsConstructor
    public static class FieldError {
        private String field;
        private String message;
    }
}
```

## 性能优化

### 1. 减少请求次数

- 合并 CSS/JS 文件
- 使用雪碧图（Sprite）
- 内联小资源（Base64）

### 2. 启用压缩

```nginx
# Nginx 配置
gzip on;
gzip_types text/plain text/css application/json application/javascript;
gzip_min_length 1000;
```

### 3. 使用 CDN

```html
<!-- 使用 CDN 加载静态资源 -->
<script src="https://cdn.example.com/vue@3.3.4/dist/vue.global.js"></script>
```

### 4. 合理设置缓存

```java
@Configuration
public class CacheConfig implements WebMvcConfigurer {
    @Override
    public void addResourceHandlers(ResourceHandlerRegistry registry) {
        registry.addResourceHandler("/static/**")
            .addResourceLocations("classpath:/static/")
            .setCachePeriod(3600);  // 1 小时
    }
}
```

## 调试工具

### curl 命令

```bash
# 查看完整请求响应
curl -v https://api.example.com/users

# 只查看响应头
curl -I https://api.example.com/users

# 发送 POST 请求
curl -X POST https://api.example.com/users \
  -H "Content-Type: application/json" \
  -d '{"name": "John"}'

# 带认证请求
curl https://api.example.com/users \
  -H "Authorization: Bearer $TOKEN"
```

### Chrome DevTools

1. F12 打开开发者工具
2. Network 标签查看请求详情
3. 右键 → Copy → Copy as cURL

## 面试高频题

### Q1: GET 和 POST 的区别？

```
1. 语义：GET 获取资源，POST 创建资源
2. 幂等：GET 幂等，POST 不幂等
3. 缓存：GET 可缓存，POST 不可缓存
4. 长度：GET 有 URL 长度限制，POST 理论上无限制
5. 安全：GET 参数暴露在 URL，POST 在请求体
```

### Q2: 301 和 302 的区别？

```
301 Moved Permanently - 永久重定向
- 浏览器会缓存，后续请求直接跳转
- SEO 权重会转移到新 URL

302 Found - 临时重定向
- 浏览器不会缓存
- SEO 权重保留在原 URL
```

### Q3: 如何保证接口安全？

```
1. HTTPS 加密传输
2. 认证（JWT/OAuth2）
3. 签名（防止篡改）
4. 限流（防止 DDoS）
5. 参数验证（防止注入）
6. 日志审计
```

## 总结

| 知识点 | 重要程度 | 面试频率 |
|--------|----------|----------|
| HTTP 方法 | ⭐⭐⭐⭐⭐ | ⭐⭐⭐⭐⭐ |
| 状态码 | ⭐⭐⭐⭐⭐ | ⭐⭐⭐⭐⭐ |
| HTTPS 原理 | ⭐⭐⭐⭐ | ⭐⭐⭐⭐ |
| 缓存机制 | ⭐⭐⭐⭐ | ⭐⭐⭐⭐ |
| HTTP/2 特性 | ⭐⭐⭐ | ⭐⭐⭐ |
| CORS | ⭐⭐⭐⭐ | ⭐⭐⭐⭐ |

## 下一步

- [ ] 学习 RESTful API 设计规范
- [ ] 实践 OAuth2 认证流程
- [ ] 深入理解 HTTP/3 QUIC 协议
