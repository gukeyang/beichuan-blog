import { defineConfig } from 'vitepress'

export default defineConfig({
  title: '北川Coding',
  description: 'Java 后端开发学习路径 - 从入门到精通',
  
  themeConfig: {
    nav: [
      { text: '首页', link: '/' },
      { text: 'Java 基础', link: '/java/' },
      { text: '数据库', link: '/database/' },
      { text: 'Spring 框架', link: '/spring/' },
      { text: '中间件', link: '/middleware/' },
      { text: '算法', link: '/algorithm/' },
      { text: '计算机基础', link: '/foundation/' },
      { text: '项目实战', link: '/project/' }
    ],

    sidebar: {
      // ========== 一、Java 语言基础 ==========
      '/java/': [
        {
          text: '一、Java 语言基础（地基阶段）',
          collapsed: false,
          items: [
            { text: 'Java 学习指南', link: '/java/' },
            {
              text: '1. 核心语法',
              collapsed: true,
              items: [
                // { text: '数据类型（基本类型 vs 引用类型）', link: '/java/data-types' },
                // { text: '运算符、流程控制', link: '/java/control-flow' },
                // { text: '数组与字符串', link: '/java/array-string' }
              ]
            },
            {
              text: '2. 面向对象编程（OOP）',
              collapsed: true,
              items: [
                // { text: '封装、继承、多态', link: '/java/oop' },
                // { text: '抽象类 vs 接口', link: '/java/abstract-interface' },
                // { text: '@Override 注解、super 关键字', link: '/java/annotations' }
              ]
            },
            {
              text: '3. 集合框架',
              collapsed: true,
              items: [
                // { text: 'List（ArrayList / LinkedList）', link: '/java/list' },
                // { text: 'Set（HashSet / TreeSet）', link: '/java/set' },
                // { text: 'Map（HashMap / ConcurrentHashMap）', link: '/java/map' },
                // { text: 'HashMap 底层原理', link: '/java/hashmap' }
              ]
            },
            {
              text: '4. 异常处理',
              collapsed: true,
              items: [
                // { text: 'Throwable 体系', link: '/java/exception' },
                // { text: '受检异常 vs 非受检异常', link: '/java/exception-types' }
              ]
            },
            {
              text: '5. 多线程与并发（后端核心！）',
              collapsed: true,
              items: [
                // { text: '线程创建方式', link: '/java/thread-create' },
                // { text: '线程池（ThreadPoolExecutor）', link: '/java/thread-pool' },
                // { text: '同步机制：synchronized、ReentrantLock', link: '/java/synchronization' },
                // { text: 'JUC 包详解', link: '/java/juc' }
              ]
            },
            {
              text: '6. Java 8+ 新特性',
              collapsed: true,
              items: [
                // { text: 'Lambda 表达式', link: '/java/lambda' },
                // { text: 'Stream API', link: '/java/stream' },
                // { text: 'Optional 避免 NPE', link: '/java/optional' },
                // { text: '新日期时间 API', link: '/java/datetime' }
              ]
            }
          ]
        }
      ],

      // ========== 二、数据库与持久层 ==========
      '/database/': [
        {
          text: '二、数据库与持久层',
          collapsed: false,
          items: [
            { text: '数据库学习指南', link: '/database/' },
            {
              text: '1. 关系型数据库（MySQL）',
              collapsed: false,
              items: [
                { text: 'MySQL 索引原理', link: '/mysql/index-principle' },
                // { text: 'SQL 基础：CRUD、JOIN', link: '/database/sql-basics' },
                // { text: '事务隔离级别', link: '/database/transaction-isolation' },
                // { text: '锁机制：行锁、间隙锁', link: '/database/lock' },
                // { text: '性能优化：慢查询、EXPLAIN', link: '/database/optimization' }
              ]
            },
            {
              text: '2. ORM 框架',
              collapsed: true,
              items: [
                // { text: 'MyBatis：XML 映射、动态 SQL', link: '/database/mybatis' },
                // { text: 'MyBatis 一级/二级缓存', link: '/database/mybatis-cache' },
                // { text: 'JPA/Hibernate 基础', link: '/database/jpa' }
              ]
            },
            {
              text: '3. NoSQL',
              collapsed: true,
              items: [
                // { text: 'Redis：5 种数据类型', link: '/database/redis-types' },
                // { text: 'Redis 持久化（RDB/AOF）', link: '/database/redis-persistence' },
                // { text: '缓存穿透/雪崩/击穿', link: '/database/cache-problems' },
                // { text: 'Redis 分布式锁', link: '/database/redis-lock' },
                // { text: 'MongoDB 基础', link: '/database/mongodb' }
              ]
            }
          ]
        }
      ],

      // ========== 三、Web 开发基础 ==========
      '/web/': [
        {
          text: '三、Web 开发基础',
          collapsed: false,
          items: [
            { text: 'Web 开发指南', link: '/web/' },
            {
              text: '1. HTTP 协议',
              collapsed: false,
              items: [
                { text: 'HTTP vs HTTPS', link: '/network/http-vs-https' },
                // { text: '请求/响应结构', link: '/web/http-structure' },
                // { text: 'HTTP 状态码详解', link: '/web/http-status' },
                // { text: 'RESTful API 设计规范', link: '/web/restful' }
              ]
            },
            {
              text: '2. Servlet & Tomcat',
              collapsed: true,
              items: [
                // { text: 'Servlet 生命周期', link: '/web/servlet' },
                // { text: 'Filter、Listener', link: '/web/filter-listener' }
              ]
            },
            {
              text: '3. 前端基础',
              collapsed: true,
              items: [
                // { text: 'HTML/CSS/JavaScript 基础', link: '/web/frontend-basics' },
                // { text: 'Axios/Fetch 调用 API', link: '/web/api-call' }
              ]
            }
          ]
        }
      ],

      // ========== 四、主流框架（Spring 全家桶） ==========
      '/spring/': [
        {
          text: '四、主流框架（Spring 全家桶）',
          collapsed: false,
          items: [
            { text: 'Spring 学习指南', link: '/spring/' },
            {
              text: '1. Spring Framework',
              collapsed: true,
              items: [
                // { text: 'IoC（控制反转）与 DI', link: '/spring/ioc-di' },
                // { text: 'AOP（面向切面编程）', link: '/spring/aop' },
                // { text: '动态代理（JDK/CGLIB）', link: '/spring/proxy' },
                // { text: '事务管理（@Transactional）', link: '/spring/transaction' }
              ]
            },
            {
              text: '2. Spring Boot（企业标配）',
              collapsed: true,
              items: [
                // { text: '自动配置原理', link: '/spring/auto-configuration' },
                // { text: 'Starter 依赖管理', link: '/spring/starter' },
                // { text: '配置文件（application.yml）', link: '/spring/config' },
                // { text: '整合 MyBatis、Redis', link: '/spring/integration' }
              ]
            },
            {
              text: '3. Spring Cloud（微服务）',
              collapsed: true,
              items: [
                // { text: '服务注册与发现：Nacos', link: '/spring/nacos' },
                // { text: '远程调用：OpenFeign', link: '/spring/feign' },
                // { text: '网关：Spring Cloud Gateway', link: '/spring/gateway' },
                // { text: '限流熔断：Sentinel', link: '/spring/sentinel' },
                // { text: '配置中心：Nacos Config', link: '/spring/config-center' }
              ]
            }
          ]
        }
      ],

      // ========== 五、中间件与高并发 ==========
      '/middleware/': [
        {
          text: '五、中间件与高并发',
          collapsed: false,
          items: [
            { text: '中间件学习指南', link: '/middleware/' },
            {
              text: '1. 消息队列',
              collapsed: true,
              items: [
                // { text: 'RabbitMQ：Exchange 类型', link: '/middleware/rabbitmq' },
                // { text: 'RabbitMQ ACK 机制', link: '/middleware/rabbitmq-ack' },
                // { text: 'Kafka：分区、副本', link: '/middleware/kafka' },
                // { text: '消息队列应用场景', link: '/middleware/mq-scenarios' }
              ]
            },
            {
              text: '2. 搜索引擎',
              collapsed: true,
              items: [
                // { text: 'Elasticsearch：倒排索引', link: '/middleware/elasticsearch' },
                // { text: 'Elasticsearch DSL 查询', link: '/middleware/es-dsl' },
                // { text: 'ELK 日志系统', link: '/middleware/elk' }
              ]
            },
            {
              text: '3. 分布式技术',
              collapsed: true,
              items: [
                // { text: '分布式锁（Redis/ZooKeeper）', link: '/middleware/distributed-lock' },
                // { text: '分布式事务：Seata', link: '/middleware/seata' },
                // { text: 'CAP 定理、BASE 理论', link: '/middleware/cap-base' }
              ]
            }
          ]
        }
      ],

      // ========== 六、工程化与运维 ==========
      '/engineering/': [
        {
          text: '六、工程化与运维',
          collapsed: false,
          items: [
            { text: '工程化学习指南', link: '/engineering/' },
            {
              text: '1. 开发工具链',
              collapsed: true,
              items: [
                // { text: 'Git 分支管理、PR 流程', link: '/engineering/git' },
                // { text: 'Maven/Gradle 依赖管理', link: '/engineering/build-tools' },
                // { text: 'Docker 镜像构建', link: '/engineering/docker' },
                // { text: 'Jenkins / GitLab CI', link: '/engineering/ci-cd' }
              ]
            },
            {
              text: '2. 监控与可观测性',
              collapsed: true,
              items: [
                // { text: '日志：Logback + ELK', link: '/engineering/logging' },
                // { text: '链路追踪：SkyWalking', link: '/engineering/tracing' },
                // { text: '指标监控：Prometheus + Grafana', link: '/engineering/monitoring' }
              ]
            },
            {
              text: '3. Linux 基础',
              collapsed: true,
              items: [
                // { text: '常用命令（ps/top/netstat）', link: '/engineering/linux-commands' },
                // { text: 'Shell 脚本编写', link: '/engineering/shell' },
                // { text: '项目部署', link: '/engineering/deployment' }
              ]
            }
          ]
        }
      ],

      // ========== 七、计算机基础 ==========
      '/foundation/': [
        {
          text: '七、计算机基础（贯穿全程）',
          collapsed: false,
          items: [
            { text: '计算机基础指南', link: '/foundation/' },
            {
              text: '1. 数据结构与算法',
              collapsed: true,
              items: [
                // { text: '数组、链表、二叉树', link: '/foundation/data-structure' },
                // { text: '动态规划（DP）', link: '/foundation/dp' },
                // { text: 'LeetCode Hot 100', link: '/foundation/leetcode' }
              ]
            },
            {
              text: '2. 操作系统',
              collapsed: false,
              items: [
                { text: '进程与线程', link: '/os/process-thread' },
                { text: '虚拟内存', link: '/os/virtual-memory' }
                // { text: '内存管理', link: '/foundation/memory' },
                // { text: 'I/O 模型', link: '/foundation/io-model' }
              ]
            },
            {
              text: '3. 计算机网络',
              collapsed: false,
              items: [
                { text: 'TCP 三次握手', link: '/network/tcp-handshake' },
                { text: 'TCP 四次挥手', link: '/network/tcp-four-way-handshake' },
                { text: 'HTTP vs HTTPS', link: '/network/http-vs-https' }
                // { text: 'TCP/IP 协议栈', link: '/foundation/tcp-ip' },
                // { text: 'DNS 解析原理', link: '/foundation/dns' }
              ]
            }
          ]
        }
      ],

      // ========== 八、项目实战 ==========
      '/project/': [
        {
          text: '八、项目实战',
          collapsed: false,
          items: [
            { text: '项目实战指南', link: '/project/' },
            {
              text: '1. 博客系统',
              collapsed: true,
              items: [
                // { text: '项目介绍', link: '/project/blog-intro' },
                // { text: 'JWT 鉴权实现', link: '/project/blog-jwt' },
                // { text: 'Markdown 支持', link: '/project/blog-markdown' }
              ]
            },
            {
              text: '2. 电商秒杀',
              collapsed: true,
              items: [
                // { text: '项目介绍', link: '/project/seckill-intro' },
                // { text: '超卖控制', link: '/project/seckill-oversell' },
                // { text: '限流降级', link: '/project/seckill-limit' }
              ]
            },
            {
              text: '3. 微服务商城',
              collapsed: true,
              items: [
                // { text: '项目介绍', link: '/project/mall-intro' },
                // { text: '服务拆分', link: '/project/mall-split' },
                // { text: '分布式事务', link: '/project/mall-transaction' }
              ]
            }
          ]
        }
      ],

      // ========== 保留原有的分类（兼容） ==========
      '/network/': [
        {
          text: '网络协议',
          collapsed: false,
          items: [
            { text: 'TCP 三次握手', link: '/network/tcp-handshake' },
            { text: 'TCP 四次挥手', link: '/network/tcp-four-way-handshake' },
            { text: 'HTTP vs HTTPS', link: '/network/http-vs-https' }
          ]
        }
      ],
      '/os/': [
        {
          text: '操作系统',
          collapsed: false,
          items: [
            { text: '虚拟内存', link: '/os/virtual-memory' },
            { text: '进程与线程', link: '/os/process-thread' }
          ]
        }
      ],
      '/mysql/': [
        {
          text: 'MySQL',
          collapsed: false,
          items: [
            { text: 'MySQL 学习指南', link: '/mysql/' },
            { text: '索引原理', link: '/mysql/index-principle' }
          ]
        }
      ]
    },

    socialLinks: [
      { icon: 'github', link: 'https://github.com/yourname' }
    ],

    footer: {
      message: '学无止境，持续更新中...',
      copyright: 'Copyright © 2024 北川Coding 版权所有'
    },

    search: {
      provider: 'local'
    }
  }
})
