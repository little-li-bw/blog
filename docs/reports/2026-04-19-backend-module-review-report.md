# 2026-04-19 后端模块开发评审报告

## 范围

- 修复：全局异常映射
- 新增：`Tag` 模块
- 新增：`SiteConfig` 模块
- 新增：`Markdown` 渲染模块

## 本轮代码变更

### 修复

- `blog-server/src/main/java/com/bowen/blog/common/GlobalExceptionHandler.java`
  - 新增 `IllegalArgumentException -> 400`
  - 新增 `NoSuchElementException -> 404`
  - 保留未知异常 `500`

### 新增模块

- `blog-server/src/main/java/com/bowen/blog/tag/**`
- `blog-server/src/main/java/com/bowen/blog/site/**`
- `blog-server/src/main/java/com/bowen/blog/post/service/PostRenderService.java`

### 测试

- `blog-server/src/test/java/com/bowen/blog/common/GlobalExceptionHandlerTest.java`
- `blog-server/src/test/java/com/bowen/blog/tag/**`
- `blog-server/src/test/java/com/bowen/blog/site/**`
- `blog-server/src/test/java/com/bowen/blog/post/service/PostRenderServiceTest.java`

## 执行过的验证命令

```bash
mvn -f blog-server/pom.xml -Dtest=GlobalExceptionHandlerTest test
mvn -f blog-server/pom.xml -Dtest=TagServiceTest,AdminTagControllerTest,PublicTagControllerTest test
mvn -f blog-server/pom.xml -Dtest=SiteConfigServiceTest,AdminSiteConfigControllerTest,PublicSiteConfigControllerTest test
mvn -f blog-server/pom.xml -Dtest=PostRenderServiceTest test
mvn -f blog-server/pom.xml test
```

## 测试结果

- 后端全量测试：`55`
- 后端全量测试：`59`
- 失败：`0`
- 错误：`0`
- 跳过：`0`

## 覆盖率结果

### Tag 模块

- 行覆盖率：`92.73%`
- 分支覆盖率：`92.86%`
- 方法覆盖率：`91.30%`

### SiteConfig 模块

- 行覆盖率：`96.36%`
- 分支覆盖率：`91.67%`
- 方法覆盖率：`95.00%`

### Markdown 渲染模块

- 行覆盖率：`100.00%`
- 分支覆盖率：`100.00%`
- 方法覆盖率：`100.00%`

### 全项目

- 行覆盖率：`93.99%`
- 分支覆盖率：`92.86%`
- 方法覆盖率：`91.97%`

## 阈值检查

按当前项目测试规范：

- 行覆盖率 `>= 80%`：通过
- 核心业务行覆盖率 `>= 90%`：`Tag`、`SiteConfig`、`Markdown` 均通过
- 分支覆盖率 `>= 75%`：通过

## 代码评审结论

### Warning

- [BlogServerApplicationTests.java](/D:/java/blog/blog-server/src/test/java/com/bowen/blog/BlogServerApplicationTests.java)
  - 仍使用 `@MockBean`，Spring Boot 3.5 已标记为待移除。当前不影响测试通过，但后续应切换到推荐替代方案，避免测试基础设施在升级时失效。

### Info

- Mockito 在 JDK 21 下仍通过动态 agent 自附加运行，构建会输出未来兼容性警告。当前不影响测试结果，但建议后续在 Maven Surefire 中显式配置 Mockito agent。

### 结论

- 本轮没有发现阻塞继续开发的功能性缺陷。
- `Tag` 和 `SiteConfig` 模块在当前范围内已满足测试与覆盖率要求，可以进入下一模块开发。
