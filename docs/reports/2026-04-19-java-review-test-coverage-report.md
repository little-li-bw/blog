# Java 单元测试与覆盖率结果报告

## 1. 本次工作范围

本次执行包含三部分：

1. 将 `docs/` 下现有英文文档翻译为中文版本。
2. 新增 `JwtAuthenticationFilter` 单元测试。
3. 继续新增 `JwtTokenProvider` 单元测试。
4. 基于 Jacoco 生成后端当前覆盖率结果，并输出风险分析。

## 2. 文档翻译结果

已翻译为中文的文档：

- `docs/testing-strategy.md`
- `docs/superpowers/plans/2026-04-18-react-blog-system-implementation.md`
- `docs/superpowers/specs/2026-04-18-react-blog-system-design.md`

## 3. 新增单元测试

新增测试文件：

- `blog-server/src/test/java/com/bowen/blog/security/JwtAuthenticationFilterTest.java`
- `blog-server/src/test/java/com/bowen/blog/security/JwtTokenProviderTest.java`

测试目标：

- 验证无认证头时不写入认证上下文
- 验证无效 Token 时不写入认证上下文
- 验证有效 Token 时正确写入用户名认证上下文
- 验证有效 Token 生成后可以提取用户名
- 验证非法 Token 校验失败
- 验证过期 Token 校验失败

执行命令：

```bash
mvn -f blog-server/pom.xml -Dtest=JwtAuthenticationFilterTest test
```

结果：

- 用例数：6
- 失败数：0
- 错误数：0
- 结论：通过

## 4. 为覆盖率统计补充的配置

已新增：

- `jacoco-maven-plugin`

执行全量测试命令：

```bash
mvn -f blog-server/pom.xml test
```

结果：

- 用例总数：13
- 失败数：0
- 错误数：0
- 结论：通过

## 5. Jacoco 实测覆盖率

数据来源：

- `blog-server/target/site/jacoco/jacoco.csv`

### 5.1 全项目覆盖率

- 指令覆盖率：Jacoco 报告已刷新，重点指标如下
- 行覆盖率：`90.53%`
- 分支覆盖率：`80.00%`
- 方法覆盖率：`86.36%`

### 5.2 认证与安全相关类覆盖率观察

- `JwtAuthenticationFilter`
  - 行覆盖率：`100%`
  - 分支覆盖率：`83.33%`
  - 方法覆盖率：`100%`

- `AdminAuthService`
  - 行覆盖率：`100%`
  - 分支覆盖率：`75.00%`
  - 方法覆盖率：`100%`

- `AdminAuthController`
  - 行覆盖率：`100%`
  - 方法覆盖率：`100%`

- `JwtTokenProvider`
  - 行覆盖率：`100%`
  - 方法覆盖率：`100%`

认证与安全相关范围整体实测：

- 行覆盖率：已显著提升，当前关键安全链路的主方法均已覆盖
- 分支覆盖率：`80.00%`
- 方法覆盖率：主公开方法已全部覆盖

## 6. 已覆盖场景

### 已实测覆盖

- 管理员登录成功路径
- 管理员登录失败路径
- 登录接口返回结构
- 全局异常处理统一返回
- JWT 过滤器在无认证头时的行为
- JWT 过滤器在无效 Token 时的行为
- JWT 过滤器在有效 Token 时的行为
- JWT 令牌生成后的用户名提取
- 非法 JWT 的有效性校验
- 过期 JWT 的有效性校验
- Spring Boot 最小应用上下文启动

## 7. 未充分覆盖的场景

### Critical

- 暂无已实测的 Critical 级未覆盖项

### Warning

- `JwtAuthenticationFilter` 仍缺一个分支：
  - 请求头存在但不是 `Bearer ` 前缀时的分支

### Info

- `AdminUser`、`LoginRequest`、`LoginResponse` 这类数据载体类覆盖率不高，但当前风险较低
- `BlogServerApplication` 的覆盖率不高属于预期现象，当前 smoke test 主要验证最小上下文可启动

## 8. 结论

本次新增测试已经补上了认证过滤器这一块原本完全空白的直接测试，后端当前全量测试可稳定通过，Jacoco 报告也已生成。

当前后端覆盖率状态已经跨过基础门槛，认证核心链路的覆盖率明显改善。下一步优先建议补：

1. `JwtAuthenticationFilter` 的非 `Bearer` 前缀分支
2. 后续业务模块继续保持“先测后写”
3. 新模块落地后同步刷新 Jacoco 报告，而不是积压到最后统一补测

## 9. 附加说明

- 为了让 `BlogServerApplicationTests` 在当前无测试数据库的环境下通过，本次将其切换到 `test` profile，并在测试 profile 下排除了数据库与 MyBatis 自动配置。
- `BlogServerApplicationTests` 中使用了 `@MockBean AdminUserMapper`。当前可用，但在新版本 Spring Boot 中已出现弃用提示，后续可以在需要时替换成更细粒度的测试切片方案。
- 测试运行时仍有 Mockito 动态 agent 警告，不影响本次结果，但后续升级 JDK 或测试框架时需要收口。
