# 部署项目

> 在现代云原生开发中，自动化部署流水线是提升交付效率的关键。本文将详细介绍如何结合 GitLab CI/CD、Docker 和 Kubernetes 实现从代码提交到生产环境部署的全流程自动化。

## 一、环境准备

在开始之前，请确保以下基础环境已经就绪：

### 1. 核心组件

| 组件 | 版本要求 | 作用 | 备注 |
| :--- | :--- | :--- | :--- |
| **GitLab** | 13.0+ | 代码托管仓库 + CI/CD 引擎 | 建议开启内置的 Container Registry（容器镜像仓库） |
| **Docker** | 20.10+ | 容器运行时 | 需要在 GitLab Runner 节点和开发机上安装 |
| **Kubernetes** | 1.20+ | 容器编排系统 | 可以是 Minikube, K3s, 或者是云厂商的 EKS/ACK |
| **GitLab Runner** | 13.0+ | 执行 CI/CD 任务的代理 | 建议安装在独立的服务器或 K8s 集群内部 |

### 2. GitLab Runner 配置

为了让 Runner 能够执行 Docker 命令并连接 K8s 集群，我们需要对其进行特权配置（Privileged Mode）。

**注册 Runner 时的关键配置：**

```bash
gitlab-runner register \
  --url "https://gitlab.example.com/" \
  --registration-token "PROJECT_REGISTRATION_TOKEN" \
  --executor "docker" \
  --docker-image "docker:stable" \
  --docker-privileged # 关键：开启特权模式，支持 Docker-in-Docker (dind)
```

---

## 二、项目结构准备

假设我们有一个基于 Spring Boot 的后端服务，项目根目录结构如下：

```text
my-project/
├── src/                  # 源代码
├── pom.xml               # Maven 依赖配置
├── Dockerfile            # 镜像构建规则
├── .gitlab-ci.yml        # CI/CD 流水线定义
└── k8s/                  # Kubernetes 部署清单
    ├── deployment.yaml   # 部署控制器
    ├── service.yaml      # 服务暴露
    └── ingress.yaml      # 外部访问入口
```

### 1. 编写 Dockerfile

一个标准的 Spring Boot Dockerfile 示例：

```dockerfile
# 第一阶段：构建 (Build)
FROM maven:3.8.6-openjdk-11 AS builder
WORKDIR /app
COPY pom.xml .
COPY src ./src
# 使用阿里云镜像加速 Maven 构建
RUN mvn package -DskipTests -s settings.xml

# 第二阶段：运行 (Run)
FROM openjdk:11-jre-slim
WORKDIR /app
# 从构建阶段复制 jar 包
COPY --from=builder /app/target/*.jar app.jar

ENV TZ=Asia/Shanghai
EXPOSE 8080

ENTRYPOINT ["java", "-jar", "app.jar"]
```

---

## 三、CI/CD 流水线配置 (.gitlab-ci.yml)

这是整个自动化流程的核心。我们将定义三个阶段：`build` (构建镜像), `test` (单元测试), `deploy` (部署到 K8s)。

```yaml
stages:
  - test
  - build
  - deploy

variables:
  # 镜像名称：使用 GitLab 内置仓库
  IMAGE_NAME: $CI_REGISTRY_IMAGE
  # 镜像标签：使用 Commit SHA 短码，确保唯一性
  IMAGE_TAG: $CI_COMMIT_SHORT_SHA
  # K8s 命名空间
  KUBE_NAMESPACE: production

# 1. 单元测试阶段
unit_test:
  stage: test
  image: maven:3.8.6-openjdk-11
  script:
    - mvn test

# 2. 构建并推送镜像阶段
build_push_image:
  stage: build
  image: docker:latest
  services:
    - docker:dind # 启用 Docker-in-Docker 服务
  before_script:
    # 登录 GitLab 容器镜像仓库
    - docker login -u $CI_REGISTRY_USER -p $CI_REGISTRY_PASSWORD $CI_REGISTRY
  script:
    - echo "构建镜像: $IMAGE_NAME:$IMAGE_TAG"
    - docker build -t $IMAGE_NAME:$IMAGE_TAG .
    - docker push $IMAGE_NAME:$IMAGE_TAG
    # 同时推送 latest 标签
    - docker tag $IMAGE_NAME:$IMAGE_TAG $IMAGE_NAME:latest
    - docker push $IMAGE_NAME:latest
  only:
    - main # 仅在 main 分支执行

# 3. 部署到 Kubernetes 阶段
deploy_to_k8s:
  stage: deploy
  image: dtzar/helm-kubectl # 包含 kubectl 工具的镜像
  script:
    # 配置 kubectl 连接信息 (这些变量需要在 GitLab CI/CD Variables 中设置)
    - kubectl config set-cluster my-k8s --server=$KUBE_URL --insecure-skip-tls-verify=true
    - kubectl config set-credentials admin --token=$KUBE_TOKEN
    - kubectl config set-context default --cluster=my-k8s --user=admin
    - kubectl config use-context default
    
    # 替换 K8s YAML 中的镜像标签变量
    - sed -i "s|{{IMAGE_TAG}}|$IMAGE_TAG|g" k8s/deployment.yaml
    - sed -i "s|{{IMAGE_NAME}}|$IMAGE_NAME|g" k8s/deployment.yaml
    
    # 执行部署
    - kubectl apply -f k8s/ -n $KUBE_NAMESPACE
    
    # 强制重启 Pod 以拉取最新镜像 (如果策略是 Always)
    - kubectl rollout restart deployment/my-app -n $KUBE_NAMESPACE
  only:
    - main
```

---

## 四、Kubernetes 部署清单详解

### 1. Deployment (deployment.yaml)

```yaml
apiVersion: apps/v1
kind: Deployment
metadata:
  name: my-app
  labels:
    app: my-app
spec:
  replicas: 2 # 副本数
  selector:
    matchLabels:
      app: my-app
  template:
    metadata:
      labels:
        app: my-app
    spec:
      containers:
      - name: my-app-container
        # 这里的变量会被 .gitlab-ci.yml 中的 sed 命令替换
        image: {{IMAGE_NAME}}:{{IMAGE_TAG}}
        imagePullPolicy: Always
        ports:
        - containerPort: 8080
        resources:
          limits:
            cpu: "1"
            memory: "1Gi"
          requests:
            cpu: "500m"
            memory: "512Mi"
        readinessProbe: #就绪探针
          httpGet:
            path: /actuator/health
            port: 8080
          initialDelaySeconds: 15
          periodSeconds: 10
      imagePullSecrets:
      - name: gitlab-registry-secret # 拉取私有镜像的凭证
```

### 2. Service (service.yaml)

```yaml
apiVersion: v1
kind: Service
metadata:
  name: my-app-svc
spec:
  type: ClusterIP
  selector:
    app: my-app
  ports:
    - protocol: TCP
      port: 80
      targetPort: 8080
```

### 3. Ingress (ingress.yaml)

```yaml
apiVersion: networking.k8s.io/v1
kind: Ingress
metadata:
  name: my-app-ingress
  annotations:
    nginx.ingress.kubernetes.io/rewrite-target: /
spec:
  rules:
  - host: api.example.com
    http:
      paths:
      - path: /
        pathType: Prefix
        backend:
          service:
            name: my-app-svc
            port:
              number: 80
```

---

## 五、总结

通过这套流程，我们实现了：
1.  **自动化**：开发者只需 `git push`，无需手动 SSH 到服务器操作。
2.  **版本化**：每次部署都对应一个具体的 Git Commit SHA，方便回滚。
3.  **高可用**：利用 K8s 的 ReplicaSet 和滚动更新机制，确保服务不中断。
4.  **环境隔离**：通过 Docker 镜像保证了开发、测试、生产环境的一致性。
