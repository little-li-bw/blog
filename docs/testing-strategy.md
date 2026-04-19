# 测试策略

## 范围

本项目采用分层验证：

- 后端按模块编写单元测试
- 前端针对数据流和渲染逻辑编写单元测试与组件测试
- 后端通过集成测试验证跨模块 API 行为
- 发布前进行人工冒烟验证

## 后端单元测试

使用：

- JUnit 5
- Mockito
- AssertJ
- 在控制器行为存在接口风险时使用 MockMvc

规则：

- Service 测试必须先于 Service 实现编写
- Service 测试对 Mapper 依赖使用 Mock
- Controller 测试要验证 HTTP 契约、状态码和返回体结构
- 每个模块都要覆盖成功路径、非法输入以及未找到或失败路径

## 前端测试

使用：

- Vitest
- React Testing Library

规则：

- fetch 调用在 API 层统一 Mock
- 组件测试关注可见行为和元数据展示
- 页面测试覆盖加载中、空状态、成功态和错误态
- Markdown 目录生成逻辑单独编写工具测试

## 集成测试

使用：

- Spring Boot Test
- MySQL Testcontainers

必须覆盖：

- 管理员登录
- 文章草稿创建
- 文章发布动作
- 首页文章列表获取
- 文章详情获取
- 分类和标签获取

## Schema 初始化

本地初始化：

1. 执行 `sql/001_schema.sql`
2. 执行 `sql/002_seed_admin.sql`

集成测试初始化：

- 通过 Testcontainers 启动 MySQL
- 在断言前加载 schema 和 seed 脚本
- 集成测试只使用最小且固定的种子数据

## 当前环境说明

当前本地机器已安装：

- JDK 21
- Maven 3.9.15

如果终端在环境变量设置之前已经打开，需要重新打开终端，确保 `JAVA_HOME`、`MAVEN_HOME` 和更新后的 `Path` 生效。
