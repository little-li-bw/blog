# GitHub Actions 自动化测试与腾讯云自动部署手册

## 适用目标

这份文档用于补齐当前博客项目的 `CI/CD` 能力，目标是把下面这句话真正落地：

`熟练使用 Linux 排查指令与 Docker，具备基于 CI/CD 的自动化部署落地能力`

这里的建议顺序很明确：

1. 先完成手动部署
2. 再做自动化测试 `CI`
3. 最后再做自动化部署 `CD`

不要跳过手动部署直接上 GitHub Actions。  
如果你还不能手动部署并排查问题，自动化只会把错误流程执行得更快。

---

## 一、先理解 CI 和 CD 是什么

很多人把这两个词写进简历，但没有真正区分它们。

### 1. CI：Continuous Integration，持续集成

CI 的核心目标是：

- 代码一提交到仓库，就自动检查它是否还能正常工作

在你的项目里，CI 最少应该包含：

- 后端测试
- 前端测试
- 前端构建

这样你每次 push 之后，都能知道：

- 有没有把后端逻辑改坏
- 有没有把前端页面改坏
- 项目还能不能正常构建

### 2. CD：Continuous Delivery / Deployment，持续交付 / 持续部署

CD 的核心目标是：

- 在 CI 全部通过后，把代码自动部署到服务器

在你的项目里，CD 可以先做成最小版：

- GitHub Actions 通过 SSH 登录腾讯云服务器
- 进入项目目录
- `git pull`
- `docker compose up -d --build`

这就已经是一个可落地的自动部署闭环。

---

## 二、你这个项目适合什么样的 CI/CD 结构

当前博客系统是：

- 前端：React + Vite
- 后端：Spring Boot
- 部署：Docker Compose
- 服务器：腾讯云 Linux

所以最合理的 GitHub Actions 结构是：

### 第一阶段：CI

触发条件：

- push 到 `main`
- pull request 到 `main`

执行内容：

1. 检出代码
2. 安装 JDK
3. 安装 Node.js
4. 跑后端测试
5. 跑前端测试
6. 跑前端构建

### 第二阶段：CD

触发条件：

- 只有 `main` 分支 push 成功
- 并且 CI 阶段通过

执行内容：

1. 通过 SSH 登录服务器
2. 进入项目目录
3. 拉取最新代码
4. 执行 Docker Compose 重建并后台启动

---

## 三、开始之前你必须准备好的东西

在写 GitHub Actions 之前，先确认下面这些前置条件。

### 1. 腾讯云服务器已经手动部署成功

你至少要能手动执行这套流程：

```bash
cd /home/deploy/blog
git pull
docker compose --env-file .env -f docker/docker-compose.yml up -d --build
```

如果这条链路没跑通，不要写 CD。

### 2. 服务器上已经安装好 Docker 和 Git

需要确认这些命令在服务器上可用：

```bash
docker --version
docker compose version
git --version
```

### 3. 服务器部署用户已经准备好

建议用普通用户，例如：

- `deploy`

不要长期直接用 `root` 做自动部署。

### 4. GitHub 仓库已经存在

你的项目已经推到 GitHub 上，这一步已经满足。

### 5. 服务器能通过 SSH 被访问

本地先验证：

```bash
ssh deploy@你的服务器公网IP
```

如果 SSH 都不能登录，GitHub Actions 也不可能自动部署成功。

---

## 四、先做 CI：自动测试与构建

这一步先不碰服务器，只做仓库内自动验证。

### 1. 在仓库中创建 workflow 目录

GitHub Actions 的工作流文件放在：

```text
.github/workflows/
```

你至少会有两个文件：

- `ci.yml`
- `deploy.yml`

建议先只做 `ci.yml`。

### 2. CI 工作流应该做什么

对你的项目，我建议最小可用版 CI 包含：

#### 后端

- 安装 JDK 21
- 缓存 Maven 依赖
- 执行：

```bash
mvn -f blog-server/pom.xml test
```

#### 前端

- 安装 Node.js
- 进入 `frontend`
- 安装依赖
- 执行：

```bash
npm ci
npm test
npm run build
```

### 3. 为什么要分后端和前端

因为你的项目不是单一技术栈：

- 后端问题通常是 Java 代码、Spring Boot、数据库逻辑
- 前端问题通常是 React 代码、组件逻辑、构建错误

把它们分开执行的好处：

- 更容易看是哪一层挂了
- 日志更清晰
- 后续也更容易拆分 job

### 4. 推荐的 CI 工作流示例

你可以创建：

`/.github/workflows/ci.yml`

```yaml
name: CI

on:
  push:
    branches: [main]
  pull_request:
    branches: [main]

jobs:
  backend-test:
    runs-on: ubuntu-latest

    steps:
      - name: Checkout code
        uses: actions/checkout@v4

      - name: Set up JDK 21
        uses: actions/setup-java@v4
        with:
          distribution: temurin
          java-version: '21'
          cache: maven

      - name: Run backend tests
        run: mvn -f blog-server/pom.xml test

  frontend-test-build:
    runs-on: ubuntu-latest

    steps:
      - name: Checkout code
        uses: actions/checkout@v4

      - name: Set up Node.js
        uses: actions/setup-node@v4
        with:
          node-version: '20'
          cache: npm
          cache-dependency-path: frontend/package-lock.json

      - name: Install frontend dependencies
        working-directory: frontend
        run: npm ci

      - name: Run frontend tests
        working-directory: frontend
        run: npm test

      - name: Build frontend
        working-directory: frontend
        run: npm run build
```

### 5. 这份 CI 工作流做了什么

你需要能看懂每一步，而不是只会复制。

#### `on`

```yaml
on:
  push:
    branches: [main]
  pull_request:
    branches: [main]
```

表示：

- 当代码 push 到 `main` 时触发
- 当有人发 PR 到 `main` 时触发

#### `runs-on: ubuntu-latest`

表示：

- 这份任务运行在 GitHub 提供的 Ubuntu 虚拟机上

#### `actions/checkout@v4`

表示：

- 把你的仓库代码拉到工作机里

#### `actions/setup-java@v4`

表示：

- 安装 JDK

#### `actions/setup-node@v4`

表示：

- 安装 Node.js

#### `cache: maven` / `cache: npm`

表示：

- 缓存依赖，减少重复下载时间

---

## 五、如何验证 CI 是否生效

把 `ci.yml` 提交到 GitHub 后：

1. push 到 `main`
2. 打开 GitHub 仓库
3. 点击 `Actions`
4. 查看工作流是否开始执行

你需要重点学会看：

- 哪个 job 失败了
- 哪一步失败了
- 失败的日志是什么

这本身就是 CI 排障能力的一部分。

---

## 六、CI 常见失败场景与排查方法

### 1. Maven 测试失败

常见原因：

- 后端测试依赖数据库环境
- 某个测试对环境变量有依赖
- JDK 版本不一致

排查方法：

- 看 Actions 日志里是哪个测试类失败
- 看异常堆栈
- 在本地执行相同命令复现：

```bash
mvn -f blog-server/pom.xml test
```

### 2. npm test 失败

常见原因：

- 前端测试依赖本地特殊环境
- 某些 mock 没有处理
- Node.js 版本差异

排查方法：

- 先看 Actions 日志
- 本地复现：

```bash
cd frontend
npm ci
npm test
```

### 3. npm run build 失败

常见原因：

- 类型错误
- 构建脚本依赖本地环境变量
- 路径引用错误

排查方法：

- 本地执行同样的命令
- 看报错文件和行号

这就是你简历里“自动化流程排障”的实际体现。

---

## 七、再做 CD：自动部署到腾讯云

当 CI 已经稳定后，再做这一步。

这里推荐你使用：

- GitHub Actions
- SSH 连接服务器
- 服务器上直接 `git pull + docker compose up`

这不是最复杂的方案，但对个人项目最实用。

---

## 八、做 CD 之前要准备什么

### 1. 服务器上的项目目录固定

例如：

```bash
/home/deploy/blog
```

### 2. 服务器上的 `.env` 已经手动配置好

例如：

```bash
/home/deploy/blog/.env
```

不要把真实 `.env` 放到 GitHub 仓库中。

### 3. 服务器上的部署命令已经手动验证过

你必须先确认这条命令能成功执行：

```bash
cd /home/deploy/blog
git pull
docker compose --env-file .env -f docker/docker-compose.yml up -d --build
```

### 4. 服务器部署用户已经具备权限

例如：

- 用户名：`deploy`
- 已加入 `docker` 用户组
- 可以 SSH 登录

---

## 九、GitHub Secrets 是什么

自动部署时，GitHub Actions 不能把密码明文写在工作流文件里。  
所以要用 GitHub Secrets 保存敏感信息。

在 GitHub 仓库中进入：

- `Settings`
- `Secrets and variables`
- `Actions`

添加下面几个 secrets。

### 1. `SERVER_HOST`

服务器公网 IP 或域名，例如：

```text
1.2.3.4
```

### 2. `SERVER_USER`

部署用户，例如：

```text
deploy
```

### 3. `SERVER_SSH_KEY`

把你本地用于登录服务器的私钥内容完整粘贴进去。

例如本地查看：

```bash
cat ~/.ssh/id_ed25519
```

注意：

- 这里是私钥，不是公钥
- 私钥只放 GitHub Secrets，不要放仓库文件里

### 4. `SERVER_PORT`

如果你没改过 SSH 端口，默认：

```text
22
```

---

## 十、为什么推荐 SSH 私钥做部署

因为这是最常见、最稳定的个人项目自动部署方案。

优势：

- 简单
- 不依赖额外部署平台
- 适合腾讯云 CVM
- 你能顺手把 Linux、SSH、权限、自动部署都串起来

你后面面试里也可以明确说：

- 使用 GitHub Actions + SSH + Docker Compose 实现自动部署

这比一句“会 CI/CD”更有说服力。

---

## 十一、推荐的自动部署工作流

你可以创建：

`/.github/workflows/deploy.yml`

```yaml
name: Deploy

on:
  push:
    branches: [main]

jobs:
  deploy:
    runs-on: ubuntu-latest

    steps:
      - name: Checkout code
        uses: actions/checkout@v4

      - name: Deploy to Tencent Cloud server
        uses: appleboy/ssh-action@v1.0.3
        with:
          host: ${{ secrets.SERVER_HOST }}
          username: ${{ secrets.SERVER_USER }}
          key: ${{ secrets.SERVER_SSH_KEY }}
          port: ${{ secrets.SERVER_PORT }}
          script: |
            cd /home/deploy/blog
            git pull origin main
            docker compose --env-file .env -f docker/docker-compose.yml up -d --build
```

---

## 十二、这份 deploy 工作流做了什么

### 1. 触发条件

```yaml
on:
  push:
    branches: [main]
```

表示：

- 只要有代码 push 到 `main`，就触发部署

### 2. `appleboy/ssh-action`

这是 GitHub Actions 中常见的 SSH 执行插件。  
作用是：

- 帮你从 GitHub 的 runner 连接到自己的服务器
- 然后在服务器上执行脚本

### 3. `script`

```bash
cd /home/deploy/blog
git pull origin main
docker compose --env-file .env -f docker/docker-compose.yml up -d --build
```

这就是你平时手动部署的命令，只不过现在交给 Actions 自动执行。

---

## 十三、为什么推荐先做“测试”和“部署”两个 workflow

你可以把它们拆成：

- `ci.yml`
- `deploy.yml`

好处：

- 结构更清晰
- CI 问题和部署问题不会混在一起
- 更方便定位失败点

对个人项目来说，这已经足够。

---

## 十四、进一步优化：让部署依赖 CI 成功

上面的最小版本已经能用，但更合理的方式是：

- 先跑 CI
- 只有 CI 通过后再部署

做法一般有两种。

### 方案 1：把测试和部署写在同一个 workflow 里

流程：

1. 后端测试
2. 前端测试
3. 前端构建
4. 全部通过后 SSH 部署

优点：

- 简单

缺点：

- 文件会逐渐变大

### 方案 2：CI 和 CD 分开，但 CD 依赖 CI

这种结构更规范，但配置复杂一点。

对你当前阶段，我建议先用最小可用方案：

- 先单独做 `ci.yml`
- 再单独做 `deploy.yml`

跑通之后再优化成“CI 成功才自动部署”。

---

## 十五、自动部署常见失败点

这是你真正学习 CI/CD 的核心部分。

### 1. SSH 登录失败

常见原因：

- 私钥不对
- GitHub Secrets 粘贴错了
- 服务器禁用了该用户登录
- SSH 端口不是 22

排查：

- 本地先验证：

```bash
ssh deploy@你的服务器IP
```

- 确认服务器用户、端口、私钥一致

### 2. 服务器上 `git pull` 失败

常见原因：

- 服务器目录不是 Git 仓库
- 远程仓库权限有问题
- 分支名不一致

排查：

登录服务器手动执行：

```bash
cd /home/deploy/blog
git status
git remote -v
git branch
git pull origin main
```

### 3. `docker compose up -d --build` 失败

常见原因：

- `.env` 缺失
- Docker 没启动
- 端口被占用
- 镜像构建失败

排查：

```bash
systemctl status docker
docker compose --env-file .env -f docker/docker-compose.yml config
docker compose --env-file .env -f docker/docker-compose.yml logs -f
docker ps -a
```

### 4. 部署成功但网站打不开

常见原因：

- 安全组没开 80/443
- Nginx 没起来
- 容器没起来
- 后端接口 500

排查：

```bash
ss -tulpen | grep :80
docker ps
docker logs blog-frontend
docker logs blog-backend
curl http://127.0.0.1
curl http://127.0.0.1/api/site-config
```

---

## 十六、你应该掌握的 CI/CD 基础知识

为了让简历内容更可信，你至少要理解这些概念。

### 1. Runner 是什么

Runner 是 GitHub Actions 实际执行命令的机器。  
`ubuntu-latest` 就表示 GitHub 给你分配了一台 Ubuntu 虚拟机来跑命令。

### 2. Workflow 是什么

Workflow 是一份自动化流程定义文件，通常是：

```text
.github/workflows/*.yml
```

### 3. Job 是什么

一个 workflow 可以包含多个 job。  
例如：

- 后端测试 job
- 前端测试 job
- 自动部署 job

### 4. Step 是什么

一个 job 里面的每一个动作就是 step。  
例如：

- checkout 代码
- 安装 Java
- 安装 Node
- 执行测试

### 5. Secret 是什么

Secret 是 GitHub 用来保存敏感信息的安全变量。  
例如：

- SSH 私钥
- 服务器 IP
- 用户名

### 6. 为什么不能把密钥写死在 workflow 里

因为 workflow 文件会进入 Git 仓库。  
一旦写死：

- 别人能看到
- 服务器就有被入侵风险

这就是基础的安全意识。

---

## 十七、推荐的学习顺序

建议你按这个节奏来：

### 第一步

先完成手动部署，并熟悉：

- `docker ps`
- `docker logs`
- `docker exec`
- `systemctl status`
- `journalctl`
- `curl`
- `ss -tulpen`

### 第二步

先写 `ci.yml`，只做：

- 后端测试
- 前端测试
- 前端构建

### 第三步

CI 稳定后，再写 `deploy.yml`，实现自动部署。

### 第四步

最后再优化成：

- CI 成功才触发 CD
- 支持 HTTPS 域名环境

---

## 十八、你简历里这段话怎么和项目对应

如果你按这份文档完整做完，你就能比较有底气地把项目经验说清楚：

- 基于 GitHub Actions 搭建前后端自动化测试流程
- 前端执行 `npm test`、`npm run build`，后端执行 Maven 测试
- 使用 GitHub Secrets 管理服务器连接信息和 SSH 私钥
- 通过 SSH 连接腾讯云服务器，结合 Docker Compose 实现自动部署
- 部署失败时，使用 Linux 与 Docker 命令进行排障和日志分析

这比笼统写“会 CI/CD”强很多。

---

## 十九、下一步建议

推荐你现在这样推进：

1. 先按前一份 Ubuntu 部署手册，把项目手动部署成功
2. 手动部署稳定后，先创建 `ci.yml`
3. 等 CI 跑通，再补 `deploy.yml`
4. 最后把 Actions 流程和排障过程记录到项目文档里

如果你下一步要正式落地，最合理的顺序是：

1. 先在仓库里新增 `.github/workflows/ci.yml`
2. push 后验证 CI
3. 再新增 `.github/workflows/deploy.yml`
4. 配置 GitHub Secrets
5. 最后验证自动部署
