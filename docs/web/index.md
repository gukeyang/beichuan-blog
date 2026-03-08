# Web 开发

前后端开发技术，涵盖 RESTful API、前端框架、安全等。

## 🔥 高频考点

### RESTful API 设计
- 资源命名规范
- HTTP 方法使用（GET、POST、PUT、DELETE）
- 状态码正确使用
- 版本控制策略
- 分页和过滤

### 认证授权
- Session vs JWT vs OAuth2
- RBAC 权限模型
- SSO 单点登录
- 第三方登录集成

### Web 安全
- XSS 攻击与防护
- CSRF 攻击与防护
- SQL 注入防护
- 敏感数据加密
- HTTPS 配置

## 📝 RESTful API 示例

```java
@RestController
@RequestMapping("/api/v1/users")
public class UserController {
    
    @GetMapping
    public Page<UserVO> listUsers(@RequestParam int page, 
                                   @RequestParam int size) {}
    
    @GetMapping("/{id}")
    public UserVO getUser(@PathVariable Long id) {}
    
    @PostMapping
    public UserVO createUser(@RequestBody @Valid UserCreateDTO dto) {}
    
    @PutMapping("/{id}")
    public UserVO updateUser(@PathVariable Long id,
                              @RequestBody @Valid UserUpdateDTO dto) {}
    
    @DeleteMapping("/{id}")
    public void deleteUser(@PathVariable Long id) {}
}
```

## 📚 推荐资源

- 📖 《RESTful Web APIs》
- 📖 《Web 安全深度剖析》
- 🌐 [MDN Web Docs](https://developer.mozilla.org/)
