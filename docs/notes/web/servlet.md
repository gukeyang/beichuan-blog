# Servlet

Java Servlet 是运行在 Web 服务器上的 Java 程序，用于处理客户端请求并生成响应。

## Servlet 生命周期

1. **加载和实例化**: 容器加载 Servlet 类并创建实例
2. **初始化**: 调用 `init()` 方法
3. **请求处理**: 调用 `service()` 方法处理请求
4. **销毁**: 调用 `destroy()` 方法释放资源

## 示例代码

```java
@WebServlet("/hello")
public class HelloServlet extends HttpServlet {
    
    @Override
    protected void doGet(HttpServletRequest request, HttpServletResponse response) 
            throws ServletException, IOException {
        response.setContentType("text/html;charset=UTF-8");
        PrintWriter out = response.getWriter();
        out.println("<h1>Hello, World!</h1>");
    }
}
```

## Servlet vs Spring MVC

- **Servlet**: 底层技术，需要手动处理请求映射
- **Spring MVC**: 基于 Servlet 的框架，提供注解和自动化配置

## 相关文档

- [Spring Framework](/notes/spring/framework)
- [Spring Boot](/notes/spring/boot)
