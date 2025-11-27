---
title: 项目部署
tags:
  - K8s
  - Docker
  - CI/CD
categories: 场景题
abbrlink: 40aba349
date: 2025-11-05 10:41:03
---

结合 GitLab、CI/CD、Docker 和 Kubernetes（K8s）部署项目的核心是实现**代码提交→自动构建→自动测试→容器化→自动部署到 K8s 集群**的全流程自动化。以下是详细的实施步骤和关键配置：

### **一、环境准备**

先确保基础环境就绪，核心组件包括：

| 组件            | 作用                  | 准备要点                                                     |
| --------------- | --------------------- | ------------------------------------------------------------ |
| GitLab          | 代码托管 + CI/CD 引擎 | 需启用内置的**Container Registry**（容器镜像仓库），用于存储 Docker 镜像。 |
| Docker          | 应用容器化            | 安装 Docker 引擎（GitLab Runner 节点和本地开发机需配置）。   |
| Kubernetes 集群 | 容器编排与运行环境    | 需有可用的 K8s 集群（如 Minikube、EKS、GKE 等），并配置`kubectl`可访问。 |
| GitLab Runner   | 执行 CI/CD 任务的代理 | 部署在可访问 K8s 集群和 GitLab 的节点上，需注册到 GitLab 项目中。 |

### **二、项目结构准备**

假设项目为一个简单的 Web 应用（如 Python/Java/Node.js），需在代码仓库中添加以下关键文件：

```
project-root/
├── src/                # 项目源代码
├── Dockerfile          # 用于构建Docker镜像的配置
├── .gitlab-ci.yml      # GitLab CI/CD流程配置
└── k8s/                # K8s部署配置文件
    ├── deployment.yaml # 定义应用部署（副本数、镜像、端口等）
    └── service.yaml    # 定义服务暴露（如NodePort/LoadBalancer）
```

### **三、核心配置详解**

#### **1. Dockerfile：容器化应用**

定义如何将应用打包为 Docker 镜像，示例（以 Node.js 为例）：

```
# 基础镜像
FROM node:16-alpine

# 工作目录
WORKDIR /app

# 复制依赖文件并安装
COPY package*.json ./
RUN npm install

# 复制源代码
COPY src/ ./

# 暴露端口（需与K8s配置一致）
EXPOSE 3000

# 启动命令
CMD ["node", "app.js"]
```

#### **2. K8s 部署配置：定义运行规则**

在`k8s/`目录下创建部署文件，示例：

- **deployment.yaml**（核心部署配置）：

```
apiVersion: apps/v1
kind: Deployment
metadata:
  name: my-app  # 部署名称
spec:
  replicas: 2   # 副本数
  selector:
    matchLabels:
      app: my-app
  template:
    metadata:
      labels:
        app: my-app
    spec:
      containers:
      - name: my-app
        image: ${CI_REGISTRY_IMAGE}:${CI_COMMIT_SHA}  # 镜像地址（使用GitLab CI变量）
        ports:
        - containerPort: 3000  # 容器内端口
      imagePullSecrets:
      - name: gitlab-registry  # 拉取镜像的凭证（需提前在K8s中创建）
```

- **service.yaml**（暴露服务）：

```
apiVersion: v1
kind: Service
metadata:
  name: my-app-service
spec:
  selector:
    app: my-app
  ports:
  - port: 80        # 服务端口
    targetPort: 3000  # 容器端口
  type: NodePort    # 暴露到集群节点（测试用，生产可用LoadBalancer）
```

#### **3. .gitlab-ci.yml：定义 CI/CD 流程**

这是核心配置文件，用于定义 “构建→测试→部署” 的自动化步骤。需定义`stages`（阶段）和对应`jobs`（任务）。

```
# 定义流程阶段（按顺序执行）
stages:
  - build    # 构建Docker镜像
  - test     # 测试镜像（可选）
  - deploy   # 部署到K8s

# 变量：可自定义或使用GitLab内置变量（如CI_REGISTRY是GitLab镜像仓库地址）
variables:
  IMAGE_NAME: $CI_REGISTRY_IMAGE  # 镜像名（格式：registry.gitlab.com/用户名/项目名）
  IMAGE_TAG: $CI_COMMIT_SHA       # 镜像标签（用提交哈希，确保唯一）

# 构建阶段：构建并推送镜像到GitLab Registry
build_image:
  stage: build
  image: docker:20.10  # 使用Docker镜像作为运行环境
  services:
    - docker:20.10-dind  # 启用Docker-in-Docker（允许在容器内运行Docker命令）
  script:
    # 登录GitLab Container Registry（使用内置变量自动获取凭证）
    - docker login -u $CI_REGISTRY_USER -p $CI_REGISTRY_PASSWORD $CI_REGISTRY
    # 构建镜像
    - docker build -t $IMAGE_NAME:$IMAGE_TAG .
    # 推送镜像到仓库
    - docker push $IMAGE_NAME:$IMAGE_TAG
  only:
    - main  # 仅main分支触发（可根据需求调整，如dev分支部署到测试环境）

# 测试阶段：运行容器内的测试（可选，根据项目需求）
test_image:
  stage: test
  image: docker:20.10
  services:
    - docker:20.10-dind
  script:
    - docker pull $IMAGE_NAME:$IMAGE_TAG
    - docker run $IMAGE_NAME:$IMAGE_TAG npm test  # 假设项目有npm test命令
  only:
    - main

# 部署阶段：将镜像部署到K8s集群
deploy_to_k8s:
  stage: deploy
  image: bitnami/kubectl:latest  # 使用带kubectl的镜像
  script:
    # 替换K8s配置中的镜像标签（使用sed命令动态注入当前构建的镜像）
    - sed -i "s|\${CI_REGISTRY_IMAGE}:${CI_COMMIT_SHA}|$IMAGE_NAME:$IMAGE_TAG|g" k8s/deployment.yaml
    # 应用K8s配置（部署应用和服务）
    - kubectl apply -f k8s/deployment.yaml
    - kubectl apply -f k8s/service.yaml
    # 检查部署状态
    - kubectl rollout status deployment/my-app
  only:
    - main
```

### **四、关键权限配置**

1. **GitLab Runner 注册**需将 Runner 注册到 GitLab 项目，确保 Runner 有权限执行 Docker 命令（启用`privileged`模式）和访问 K8s 集群。注册命令示例：

   ```
   gitlab-runner register \
     --url https://gitlab.com/ \
     --registration-token YOUR_PROJECT_REGISTRATION_TOKEN \
     --executor docker \
     --docker-image docker:20.10 \
     --docker-privileged  # 允许Docker-in-Docker
   ```

   

2. **K8s 镜像拉取凭证**GitLab Container Registry 默认需要认证，需在 K8s 中创建`imagePullSecrets`，让 K8s 能拉取镜像：

   ```
   # 创建凭证（用户名：GitLab用户名，密码：Personal Access Token，权限需包含read_registry）
   kubectl create secret docker-registry gitlab-registry \
     --docker-server=registry.gitlab.com \
     --docker-username=YOUR_GITLAB_USERNAME \
     --docker-password=YOUR_GITLAB_TOKEN
   ```

   （注意：`secret`名称需与`deployment.yaml`中的`imagePullSecrets.name`一致）

3. **Runner 访问 K8s 权限**若 Runner 部署在 K8s 集群内，可通过`ServiceAccount`绑定权限；若在外部，需将`kubeconfig`文件作为**GitLab CI/CD 变量**（变量名`KUBECONFIG`）传入 Runner，确保`kubectl`能访问集群。

### **五、触发与验证**

1. **触发流程**：提交代码到`main`分支，GitLab 会自动检测到`.gitlab-ci.yml`并启动 CI/CD 流程（在项目的 “CI/CD→流水线” 中查看进度）。
2. 验证部署：
   - 检查镜像是否推送到 GitLab Registry（项目→Packages & Registries→Container Registry）。
   - 检查 K8s 部署状态：`kubectl get pods`（应显示 2 个运行中的 Pod）、`kubectl get svc`（查看服务暴露的端口）。
   - 访问应用：通过`节点IP:NodePort`访问（如`http://192.168.56.101:30080`，其中 30080 是 Service 的 NodePort）。

### **六、扩展优化**

- **多环境部署**：通过`rules`或`only`区分分支（如`dev`分支部署到测试环境，`main`分支部署到生产）。
- **镜像清理**：添加定时任务清理旧镜像，避免 Registry 存储占用过高。
- **监控告警**：集成 Prometheus+Grafana 监控 K8s 集群和应用状态，配置 GitLab CI 失败告警（如邮件、Slack）。
