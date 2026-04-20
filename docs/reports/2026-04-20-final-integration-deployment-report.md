# 2026-04-20 集成测试与部署收尾报告

## 变更范围

- 新增后端 H2 集成测试基座
- 新增发布主链路集成测试
- 新增公开元数据接口集成测试
- 补齐 Docker Compose、前后端 Dockerfile、Nginx 配置
- 补齐后端本地/MySQL 运行配置
- 修复 `PostMapper` 上一篇/下一篇 SQL 比较符错误
- 更新仓库根目录 `README.md`

## 本轮代码评审结论

### Blocking

- 无

### Warning

- [BlogServerApplicationTests.java](D:/java/blog/blog-server/src/test/java/com/bowen/blog/BlogServerApplicationTests.java) 仍然使用 `@MockBean`，Spring Boot 3.5 已标记为待移除，后续需要替换为新的测试注入方式。
- Maven 测试仍会输出 Mockito 动态 agent 警告，不影响当前通过结果，但后续 JDK 默认策略收紧后需要处理。
- `docker compose config` 在当前环境会提示无法读取 `C:\\Users\\libowen\\.docker\\config.json`，但 Compose 配置本身已成功解析。

## 集成测试新增项

- [AdminPublishFlowIntegrationTest.java](D:/java/blog/blog-server/src/test/java/com/bowen/blog/integration/AdminPublishFlowIntegrationTest.java)
  - 覆盖管理员登录
  - 覆盖文章创建
  - 覆盖文章发布
  - 覆盖首页公开列表读取
  - 覆盖文章详情读取
  - 覆盖阅读量递增

- [PublicMetadataIntegrationTest.java](D:/java/blog/blog-server/src/test/java/com/bowen/blog/integration/PublicMetadataIntegrationTest.java)
  - 覆盖站点配置公开读取
  - 覆盖分类公开读取
  - 覆盖标签公开读取

## 验证命令

后端：

```bash
mvn -f blog-server/pom.xml test
```

前端：

```bash
cd frontend
npm test
npm run lint
npm run build
npm run test:coverage
```

部署配置：

```bash
docker compose -f docker/docker-compose.yml config
```

## 验证结果

- 后端测试：`92` 个，通过 `92`，失败 `0`
- 前端测试：`18` 个，通过 `18`，失败 `0`
- 前端 TypeScript 检查：通过
- 前端生产构建：通过
- Docker Compose 配置解析：通过

## 覆盖率结果

### 后端 Jacoco

- 指令覆盖率：`95.74%`
- 分支覆盖率：`77.21%`
- 行覆盖率：`96.68%`
- 方法覆盖率：`97.51%`

### 前端 Vitest

- 语句覆盖率：`89.95%`
- 分支覆盖率：`78.43%`
- 函数覆盖率：`76.53%`
- 行覆盖率：`89.95%`

## 本轮修复的真实问题

- [PostMapper.java](D:/java/blog/blog-server/src/main/java/com/bowen/blog/post/mapper/PostMapper.java)
  - `findPreviousPublished` 和 `findNextPublished` 原先把 `<`、`>` 写成了 HTML 转义字符。
  - 单元测试没有暴露这个问题，集成测试首次覆盖到真实 SQL 路径后触发了 `BadSqlGrammarException`。
  - 当前已修复并通过全量验证。

## 当前状态

- 业务主链路可用
- 集成测试已补齐最关键的从登录到发布再到公开读取路径
- 部署文件已具备本地和腾讯云容器化部署基础
- 这批改动可以进入阶段性提交
