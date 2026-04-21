# 腾讯云 Ubuntu 22.04 博客部署与 Linux/Docker 学习手册

## 适用目标

这份手册适合下面这类场景：

- 想把当前博客项目部署到腾讯云服务器
- 想系统补一遍 `Linux`、`Docker`、基础运维排查
- 想让简历里的这句话更有实际支撑：

`熟练使用 Linux 排查指令与 Docker，具备基于 CI/CD 的自动化部署落地能力`

这份文档的核心思路不是先追求自动化，而是先把整条链路跑通：

1. 重装主流 Linux 系统
2. 完成服务器基础初始化
3. 手动部署项目
4. 学会用 Linux 和 Docker 排查问题
5. 最后再补 GitHub Actions 做 CI/CD

如果手动部署都没有跑通，就不要急着上 CI/CD。那不是自动化能力，只是把错误自动化。

---

## 一、系统选择建议

在腾讯云重装系统时，建议这样选择：

- 方式：`基于操作系统镜像`
- 系统：`Ubuntu`
- 版本：`Ubuntu 22.04 LTS`
- 登录方式：优先 `SSH 密钥`

不建议选：

- `CentOS 7.6`

原因：

- 已经过时
- 不适合学习现代 Docker / CI/CD 流程
- 教程和社区支持不如 Ubuntu 方便

---

## 二、整体学习与部署路线

建议按下面 6 个阶段推进：

1. 重装 Ubuntu 22.04
2. 初始化服务器基础环境
3. 安装 Git、Docker、Docker Compose
4. 从 GitHub 拉代码并手动部署
5. 学会使用 Linux 和 Docker 排查问题
6. 最后接 GitHub Actions 做自动化部署

这条路线更符合工程实际，也更适合写进简历。

---

## 三、第一阶段：重装系统后第一次登录

假设服务器公网 IP 为 `1.2.3.4`。

如果使用密码登录：

```bash
ssh root@1.2.3.4
```

如果使用 SSH 密钥登录：

```bash
ssh -i ~/.ssh/your_private_key root@1.2.3.4
```

首次登录后，先确认系统信息：

```bash
cat /etc/os-release
uname -a
whoami
pwd
```

命令说明：

- `cat /etc/os-release`：查看当前 Linux 发行版和版本信息
- `uname -a`：查看内核与系统基础信息
- `whoami`：查看当前登录用户
- `pwd`：查看当前所在目录

你的目标是确认当前系统确实已经是 `Ubuntu 22.04`。

---

## 四、第二阶段：服务器基础初始化

### 1. 更新系统

```bash
apt update
apt upgrade -y
```

命令说明：

- `apt update`：刷新软件源索引
- `apt upgrade -y`：升级已安装的软件包
- `-y`：自动确认安装和升级

### 2. 安装常用工具

```bash
apt install -y git curl wget vim unzip ca-certificates gnupg lsb-release net-tools
```

这些工具的用途：

- `git`：拉取代码
- `curl`：请求 HTTP 接口，排查服务时很常用
- `wget`：下载文件
- `vim`：编辑配置文件
- `unzip`：解压缩
- `ca-certificates`：HTTPS 证书基础支持
- `gnupg`：处理签名与密钥
- `lsb-release`：辅助查看系统版本
- `net-tools`：提供 `netstat` 等传统网络工具

### 3. 设置时区

```bash
timedatectl set-timezone Asia/Shanghai
timedatectl
```

命令说明：

- `timedatectl set-timezone Asia/Shanghai`：设置系统时区为中国时区
- `timedatectl`：查看当前时间、时区和同步状态

---

## 五、第三阶段：创建普通部署用户

长期直接使用 `root` 部署和维护不是好习惯。建议创建一个普通用户，例如 `deploy`。

### 1. 创建用户

```bash
adduser deploy
```

按提示设置密码。

### 2. 加入 sudo 组

```bash
usermod -aG sudo deploy
```

命令说明：

- `adduser deploy`：创建新用户
- `usermod -aG sudo deploy`：把 `deploy` 加入 sudo 管理组
- `sudo`：允许普通用户临时提升权限执行管理命令

### 3. 测试切换

```bash
su - deploy
whoami
```

如果输出是 `deploy`，说明切换成功。

---

## 六、第四阶段：配置 SSH 基础安全

如果你准备长期维护这台服务器，建议使用 SSH 密钥登录。

### 1. 在本地生成 SSH 密钥

```bash
ssh-keygen -t ed25519 -C "your_email@example.com"
```

### 2. 查看公钥

```bash
cat ~/.ssh/id_ed25519.pub
```

把输出内容复制出来。

### 3. 在服务器上配置授权公钥

```bash
mkdir -p /home/deploy/.ssh
chmod 700 /home/deploy/.ssh
vim /home/deploy/.ssh/authorized_keys
chmod 600 /home/deploy/.ssh/authorized_keys
chown -R deploy:deploy /home/deploy/.ssh
```

命令说明：

- `authorized_keys`：保存允许登录当前用户的公钥
- `chmod 700` / `chmod 600`：设置 SSH 推荐权限，权限太宽可能导致 SSH 拒绝使用该文件
- `chown -R deploy:deploy`：把目录和文件归属改为 `deploy`

配置完成后，可以这样登录：

```bash
ssh deploy@1.2.3.4
```

---

## 七、第五阶段：安装 Docker

Ubuntu 22.04 上先用系统源安装，足够当前项目使用。

### 1. 安装 Docker 和 Compose

```bash
sudo apt install -y docker.io docker-compose-v2
```

### 2. 启动 Docker 并设置开机自启

```bash
sudo systemctl enable docker
sudo systemctl start docker
sudo systemctl status docker
```

### 3. 把当前用户加入 docker 组

```bash
sudo usermod -aG docker $USER
```

执行后需要重新登录 SSH 一次，组权限才会生效。

### 4. 检查版本

```bash
docker --version
docker compose version
```

命令说明：

- `systemctl enable docker`：设置 Docker 开机自动启动
- `systemctl start docker`：立即启动 Docker 服务
- `systemctl status docker`：查看 Docker 服务状态
- `docker --version`：确认 Docker 是否安装成功
- `docker compose version`：确认 Compose 插件是否可用

---

## 八、第六阶段：Linux 排查基础命令

这部分对应你简历中的“熟练使用 Linux 排查指令”。

### 1. 查看内存和磁盘

```bash
free -h
df -h
top
```

命令说明：

- `free -h`：查看内存使用情况
- `df -h`：查看磁盘空间使用情况
- `top`：实时查看 CPU、内存和进程资源占用

### 2. 查看端口监听

```bash
ss -tulpen
```

命令说明：

- `ss`：查看网络连接和监听端口
- `-t`：TCP
- `-u`：UDP
- `-l`：仅查看监听状态
- `-p`：显示对应进程
- `-e`：显示扩展信息
- `-n`：使用数字方式显示地址和端口

重点关注：

- `22`：SSH
- `80`：HTTP
- `443`：HTTPS
- `3306`：MySQL
- `8080`：后端服务

### 3. 查看进程

```bash
ps -ef | grep docker
ps -ef | grep nginx
```

命令说明：

- `ps -ef`：查看系统中的全部进程
- `grep nginx`：过滤出 nginx 相关进程

### 4. 查看服务状态

```bash
systemctl status docker
systemctl status nginx
```

### 5. 查看系统服务日志

```bash
journalctl -u docker -n 100 --no-pager
journalctl -u nginx -n 100 --no-pager
```

命令说明：

- `journalctl`：查看 systemd 管理的服务日志
- `-u docker`：指定 Docker 服务
- `-n 100`：只查看最近 100 行
- `--no-pager`：不进入翻页模式，直接输出

---

## 九、第七阶段：从 GitHub 拉取项目

切到普通用户目录：

```bash
cd /home/deploy
git clone https://github.com/little-li-bw/blog.git
cd blog
```

查看目录结构：

```bash
ls
ls -la
```

命令说明：

- `ls`：列出当前目录内容
- `ls -la`：列出详细信息并显示隐藏文件

你应该能看到：

- `frontend`
- `blog-server`
- `docker`
- `sql`
- `README.md`
- `.env.example`

---

## 十、第八阶段：创建部署环境配置

从示例文件复制出真实配置：

```bash
cp .env.example .env
vim .env
```

填写真实值，例如：

```env
MYSQL_ROOT_PASSWORD=你的强密码
BLOG_JWT_SECRET=一串足够长的随机密钥
SPRING_DATASOURCE_USERNAME=root
SPRING_DATASOURCE_PASSWORD=你的强密码
SPRING_DATASOURCE_URL=jdbc:mysql://mysql:3306/blog?useSSL=false&allowPublicKeyRetrieval=true&serverTimezone=Asia/Shanghai&characterEncoding=utf8
```

说明：

- `.env.example`：公开的示例配置
- `.env`：真实部署配置，不应该提交到 GitHub
- `BLOG_JWT_SECRET`：JWT 的签名密钥，必须自行修改且长度要足够长

---

## 十一、第九阶段：检查 Compose 配置

先检查配置是否可解析，不要急着启动：

```bash
docker compose --env-file .env -f docker/docker-compose.yml config
```

这条命令成功，说明：

- `.env` 已被正确读取
- `docker-compose.yml` 没有语法错误
- 关键环境变量已正确注入

这是一个很重要的运维习惯。以后每次修改 Compose，都应该先执行一次。

---

## 十二、第十阶段：启动项目

执行：

```bash
docker compose --env-file .env -f docker/docker-compose.yml up -d --build
```

命令说明：

- `up`：启动服务
- `-d`：后台运行
- `--build`：如镜像需要重建，则先构建再启动

查看运行中的容器：

```bash
docker ps
```

你应该能看到：

- `blog-mysql`
- `blog-backend`
- `blog-frontend`

---

## 十三、第十一阶段：Docker 排查基础命令

这部分对应你简历中的 “熟练使用 Docker”。

### 1. 查看容器

```bash
docker ps
docker ps -a
```

命令说明：

- `docker ps`：查看正在运行的容器
- `docker ps -a`：查看所有容器，包括退出的容器

### 2. 查看日志

```bash
docker logs blog-backend
docker logs blog-frontend
docker logs blog-mysql
```

实时跟踪日志：

```bash
docker logs -f blog-backend
```

命令说明：

- `docker logs`：查看容器日志
- `-f`：实时跟踪日志输出

### 3. 进入容器

```bash
docker exec -it blog-backend /bin/sh
docker exec -it blog-mysql mysql -uroot -p
```

命令说明：

- `docker exec -it`：进入运行中的容器交互执行命令
- `/bin/sh`：进入容器 shell

### 4. 查看镜像和资源占用

```bash
docker images
docker stats
```

命令说明：

- `docker images`：查看本机镜像列表
- `docker stats`：实时查看容器资源使用情况

---

## 十四、第十二阶段：验证服务是否正常

先在服务器本机验证：

```bash
curl http://127.0.0.1
curl http://127.0.0.1/api/site-config
curl http://127.0.0.1/api/categories
```

命令说明：

- `curl http://127.0.0.1`：验证前端首页是否正常
- `curl http://127.0.0.1/api/site-config`：验证前后端转发和后端接口
- `curl http://127.0.0.1/api/categories`：验证数据库读取是否正常

如果本机访问正常，再在浏览器访问：

```text
http://你的服务器公网IP
```

---

## 十五、第十三阶段：如何判断故障点

部署失败时，不要乱改配置，先定位问题在哪一层。

推荐排查顺序：

### 1. 看容器是否启动

```bash
docker ps
```

### 2. 看前端容器日志

```bash
docker logs blog-frontend
```

### 3. 看后端容器日志

```bash
docker logs blog-backend
```

### 4. 看数据库容器日志

```bash
docker logs blog-mysql
```

### 5. 看 80 端口是否监听

```bash
ss -tulpen | grep :80
```

### 6. 看服务器本机是否可访问

```bash
curl http://127.0.0.1
curl http://127.0.0.1/api/site-config
```

判断逻辑：

- 如果本机也访问不通，问题在容器、后端、数据库或 Nginx
- 如果本机能访问，但公网不能访问，问题多半在腾讯云安全组、服务器防火墙、端口放行或域名解析

这套思路就是 Linux 和 Docker 排障的基本方法。

---

## 十六、第十四阶段：域名和 HTTPS

等 HTTP 访问跑通后，再做这一层。

你需要：

- 购买域名
- 把域名解析到服务器公网 IP
- 开放 `80` 和 `443`
- 使用 Nginx + Certbot 申请 HTTPS 证书

这部分建议放到 Docker 和手动部署已经稳定之后再做，否则会把问题混在一起。

---

## 十七、第十五阶段：CI/CD 的学习顺序

CI/CD 建议分两步做。

### 第一步：先做 CI

目标：

- 代码 push 到 GitHub 后自动执行测试

建议内容：

- 后端测试
- 前端测试
- 前端构建

### 第二步：再做 CD

目标：

- CI 全通过后，自动部署到腾讯云服务器

典型动作：

- 通过 SSH 登录服务器
- 进入项目目录
- `git pull`
- `docker compose up -d --build`

只有你已经手动部署成功，CD 才有意义。否则只是把错误流程自动执行一遍。

---

## 十八、简历中的能力如何落地

如果你想让这句话成立：

`熟练使用 Linux 排查指令与 Docker，具备基于 CI/CD 的自动化部署落地能力`

至少要做到下面这些事。

### Linux 排查

你能够熟练使用：

- `top`
- `free -h`
- `df -h`
- `ss -tulpen`
- `ps -ef`
- `systemctl status`
- `journalctl -u`
- `curl`

### Docker

你能够熟练使用：

- `docker ps`
- `docker logs`
- `docker exec`
- `docker stats`
- `docker compose up`
- `docker compose logs`

### CI/CD

你至少要有一套真实流程：

- GitHub Actions 在 push 后自动跑测试
- 测试通过后自动部署到腾讯云服务器
- 部署失败时知道去哪里看日志、怎么排查

如果只是“会手动把代码传到服务器上”，这还不算 CI/CD。

---

## 十九、建议的实际执行顺序

你现在最适合按这个顺序推进：

1. 重装 Ubuntu 22.04
2. 安装 Git、Docker、Docker Compose
3. 手动部署博客项目
4. 跑通公网访问
5. 记录每一步的命令和故障
6. 最后接 GitHub Actions

---

## 二十、下一步建议

如果你已经重装成 `Ubuntu 22.04`，下一步就可以继续做：

1. 登录服务器
2. 安装基础工具
3. 安装 Docker
4. 从 GitHub 拉代码
5. 配置 `.env`
6. 执行 `docker compose up -d --build`
7. 用 `curl`、`docker logs`、`ss -tulpen` 验证和排查

这条链路跑通后，你再补 HTTPS 和 GitHub Actions，会更稳。

配套的自动化测试与自动部署文档见：

- `docs/github-actions-cicd-deployment-guide.md`
