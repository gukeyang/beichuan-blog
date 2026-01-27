# Servlet 与 Tomcat

Servlet 是 Java Web 的核心规范，Tomcat 是最常用的 Servlet 容器。

## 1. Servlet 生命周期

1. **加载和实例化**：容器启动或第一次请求时加载。
2. **初始化 (`init`)**：调用 `init()` 方法，只执行一次。
3. **请求处理 (`service`)**：每次请求都会调用 `service()`，分发给 `doGet`/`doPost`。
4. **销毁 (`destroy`)**：容器关闭时调用。

## 2. Filter 过滤器

用于拦截请求和响应，常用于登录验证、字符编码设置、日志记录。

## 3. Listener 监听器

监听 Web 应用中的事件（如 Session 创建/销毁、应用启动/停止）。
