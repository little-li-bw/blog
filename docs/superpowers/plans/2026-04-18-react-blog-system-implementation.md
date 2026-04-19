# React 博客系统实现计划

> 适用于按任务逐步推进的执行型代理。任务使用 `- [ ]` 复选框语法跟踪进度。

**目标：** 构建一个已确认范围的 `React + Spring Boot` 个人博客系统，包含首页、文章详情页、单管理员后台，并严格执行“模块级单元测试优先，最终统一集成测试”的测试策略。

**架构：** 保留现有 `frontend/` React 项目作为公网站点的视觉基线，新建 `blog-server/` 作为 Spring Boot 单体后端。如果前台联调稳定后仍有需要，再补独立 React 管理端。公网路由保持最小化，只保留首页和文章详情。后端模块按业务职责拆分，确保每个模块可以先独立完成单元测试，再进行跨模块集成。

**技术栈：** React、Vite、TypeScript、Tailwind CSS、react-router-dom、react-markdown、Vitest、React Testing Library、Java、Spring Boot、Spring Security、JWT、MyBatis-Plus、MySQL、JUnit 5、Mockito、MockMvc、Testcontainers、Docker Compose、Nginx

---

## 文件结构

### 需要修改的现有文件

- 修改：`frontend/src/App.tsx`
- 修改：`frontend/src/components/Layout.tsx`
- 修改：`frontend/src/components/BlogCard.tsx`
- 修改：`frontend/src/pages/Home.tsx`
- 修改：`frontend/src/pages/BlogDetail.tsx`
- 修改：`frontend/src/constants.ts`
- 修改：`frontend/src/types.ts`
- 修改：`frontend/package.json`
- 修改：`README.md`

### 需要创建的前端文件

- 创建：`frontend/src/api/client.ts`
- 创建：`frontend/src/api/posts.ts`
- 创建：`frontend/src/api/site.ts`
- 创建：`frontend/src/hooks/usePosts.ts`
- 创建：`frontend/src/hooks/usePostDetail.ts`
- 创建：`frontend/src/hooks/useSiteConfig.ts`
- 创建：`frontend/src/components/filters/PostSearchBar.tsx`
- 创建：`frontend/src/components/filters/PostCategoryFilter.tsx`
- 创建：`frontend/src/components/filters/PostTagFilter.tsx`
- 创建：`frontend/src/components/blog/PostListSection.tsx`
- 创建：`frontend/src/components/blog/PostMeta.tsx`
- 创建：`frontend/src/components/blog/PostToc.tsx`
- 创建：`frontend/src/components/common/LoadingState.tsx`
- 创建：`frontend/src/components/common/EmptyState.tsx`
- 创建：`frontend/src/components/common/ErrorState.tsx`
- 创建：`frontend/src/lib/toc.ts`
- 创建：`frontend/src/lib/format.ts`
- 创建：`frontend/src/test/setup.ts`
- 创建：`frontend/src/api/posts.test.ts`
- 创建：`frontend/src/api/site.test.ts`
- 创建：`frontend/src/lib/toc.test.ts`
- 创建：`frontend/src/components/BlogCard.test.tsx`
- 创建：`frontend/src/pages/Home.test.tsx`
- 创建：`frontend/src/pages/BlogDetail.test.tsx`

### 需要创建的后端文件

- 创建：`blog-server/pom.xml`
- 创建：`blog-server/src/main/java/com/bowen/blog/BlogServerApplication.java`
- 创建：`blog-server/src/main/resources/application.yml`
- 创建：`blog-server/src/main/resources/application-dev.yml`
- 创建：`blog-server/src/main/resources/application-test.yml`
- 创建：`blog-server/src/main/java/com/bowen/blog/common/ApiResponse.java`
- 创建：`blog-server/src/main/java/com/bowen/blog/common/GlobalExceptionHandler.java`
- 创建：`blog-server/src/main/java/com/bowen/blog/config/SecurityConfig.java`
- 创建：`blog-server/src/main/java/com/bowen/blog/config/JacksonConfig.java`
- 创建：`blog-server/src/main/java/com/bowen/blog/security/JwtTokenProvider.java`
- 创建：`blog-server/src/main/java/com/bowen/blog/security/JwtAuthenticationFilter.java`
- 创建：`blog-server/src/main/java/com/bowen/blog/auth/controller/AdminAuthController.java`
- 创建：`blog-server/src/main/java/com/bowen/blog/auth/service/AdminAuthService.java`
- 创建：`blog-server/src/main/java/com/bowen/blog/auth/dto/LoginRequest.java`
- 创建：`blog-server/src/main/java/com/bowen/blog/auth/vo/LoginResponse.java`
- 创建：`blog-server/src/main/java/com/bowen/blog/auth/entity/AdminUser.java`
- 创建：`blog-server/src/main/java/com/bowen/blog/auth/mapper/AdminUserMapper.java`
- 创建：`blog-server/src/main/java/com/bowen/blog/post/entity/Post.java`
- 创建：`blog-server/src/main/java/com/bowen/blog/post/entity/PostTag.java`
- 创建：`blog-server/src/main/java/com/bowen/blog/post/controller/AdminPostController.java`
- 创建：`blog-server/src/main/java/com/bowen/blog/post/controller/PublicPostController.java`
- 创建：`blog-server/src/main/java/com/bowen/blog/post/service/PostService.java`
- 创建：`blog-server/src/main/java/com/bowen/blog/post/service/PostRenderService.java`
- 创建：`blog-server/src/main/java/com/bowen/blog/post/mapper/PostMapper.java`
- 创建：`blog-server/src/main/java/com/bowen/blog/post/mapper/PostTagMapper.java`
- 创建：`blog-server/src/main/java/com/bowen/blog/post/dto/AdminPostSaveRequest.java`
- 创建：`blog-server/src/main/java/com/bowen/blog/post/dto/PostStatusUpdateRequest.java`
- 创建：`blog-server/src/main/java/com/bowen/blog/post/dto/PublicPostQuery.java`
- 创建：`blog-server/src/main/java/com/bowen/blog/post/vo/PostListItemVO.java`
- 创建：`blog-server/src/main/java/com/bowen/blog/post/vo/PostDetailVO.java`
- 创建：`blog-server/src/main/java/com/bowen/blog/post/vo/PostPrevNextVO.java`
- 创建：`blog-server/src/main/java/com/bowen/blog/category/entity/Category.java`
- 创建：`blog-server/src/main/java/com/bowen/blog/category/controller/AdminCategoryController.java`
- 创建：`blog-server/src/main/java/com/bowen/blog/category/controller/PublicCategoryController.java`
- 创建：`blog-server/src/main/java/com/bowen/blog/category/service/CategoryService.java`
- 创建：`blog-server/src/main/java/com/bowen/blog/category/mapper/CategoryMapper.java`
- 创建：`blog-server/src/main/java/com/bowen/blog/tag/entity/Tag.java`
- 创建：`blog-server/src/main/java/com/bowen/blog/tag/controller/AdminTagController.java`
- 创建：`blog-server/src/main/java/com/bowen/blog/tag/controller/PublicTagController.java`
- 创建：`blog-server/src/main/java/com/bowen/blog/tag/service/TagService.java`
- 创建：`blog-server/src/main/java/com/bowen/blog/tag/mapper/TagMapper.java`
- 创建：`blog-server/src/main/java/com/bowen/blog/site/entity/SiteConfig.java`
- 创建：`blog-server/src/main/java/com/bowen/blog/site/controller/AdminSiteConfigController.java`
- 创建：`blog-server/src/main/java/com/bowen/blog/site/controller/PublicSiteConfigController.java`
- 创建：`blog-server/src/main/java/com/bowen/blog/site/service/SiteConfigService.java`
- 创建：`blog-server/src/main/java/com/bowen/blog/site/mapper/SiteConfigMapper.java`
- 创建：`blog-server/src/main/java/com/bowen/blog/upload/entity/UploadFile.java`
- 创建：`blog-server/src/main/java/com/bowen/blog/upload/controller/UploadController.java`
- 创建：`blog-server/src/main/java/com/bowen/blog/upload/service/UploadService.java`
- 创建：`blog-server/src/main/java/com/bowen/blog/upload/mapper/UploadFileMapper.java`
- 创建：`blog-server/src/main/java/com/bowen/blog/stats/service/PostViewService.java`
- 创建：`blog-server/src/test/java/com/bowen/blog/auth/service/AdminAuthServiceTest.java`
- 创建：`blog-server/src/test/java/com/bowen/blog/post/service/PostServiceTest.java`
- 创建：`blog-server/src/test/java/com/bowen/blog/post/service/PostRenderServiceTest.java`
- 创建：`blog-server/src/test/java/com/bowen/blog/category/service/CategoryServiceTest.java`
- 创建：`blog-server/src/test/java/com/bowen/blog/tag/service/TagServiceTest.java`
- 创建：`blog-server/src/test/java/com/bowen/blog/site/service/SiteConfigServiceTest.java`
- 创建：`blog-server/src/test/java/com/bowen/blog/upload/service/UploadServiceTest.java`
- 创建：`blog-server/src/test/java/com/bowen/blog/stats/service/PostViewServiceTest.java`
- 创建：`blog-server/src/test/java/com/bowen/blog/post/controller/PublicPostControllerTest.java`
- 创建：`blog-server/src/test/java/com/bowen/blog/auth/controller/AdminAuthControllerTest.java`
- 创建：`blog-server/src/test/java/com/bowen/blog/integration/PublicSiteIntegrationTest.java`
- 创建：`blog-server/src/test/java/com/bowen/blog/integration/AdminFlowIntegrationTest.java`

### 需要创建的仓库与部署文件

- 创建：`sql/001_schema.sql`
- 创建：`sql/002_seed_admin.sql`
- 创建：`docker/docker-compose.yml`
- 创建：`docker/nginx.conf`
- 创建：`docs/testing-strategy.md`

## 测试策略要求

实现过程中必须满足以下门槛：

1. 每个后端 Service 模块都要先写单元测试，再写实现。
2. 公开契约风险高的后端 Controller 必须补 Controller 测试。
3. 前端数据客户端和关键页面在接入真实 API 前要先完成单元测试或组件测试。
4. 模块只有在本地单元测试通过后，才能视为完成。
5. 最终发布前必须完成以下流程的集成测试：
   - 管理员登录
   - 文章 CRUD
   - 文章发布流程
   - 首页文章读取
   - 文章详情读取
   - 分类与标签读取

## 任务 1：搭建 Spring Boot 后端骨架

**文件：**
- 创建：`blog-server/pom.xml`
- 创建：`blog-server/src/main/java/com/bowen/blog/BlogServerApplication.java`
- 创建：`blog-server/src/main/resources/application.yml`
- 创建：`blog-server/src/main/resources/application-dev.yml`
- 创建：`blog-server/src/main/resources/application-test.yml`
- 测试：`blog-server/src/test/java/com/bowen/blog/BlogServerApplicationTests.java`

- [ ] 第 1 步：先写失败的应用上下文测试
- [ ] 第 2 步：执行测试，确认由于应用不存在而失败
- [ ] 第 3 步：补最小后端启动实现
- [ ] 第 4 步：重新执行测试，确认通过
- [ ] 第 5 步：提交

## 任务 2：补共享后端基础设施

**文件：**
- 创建：`blog-server/src/main/java/com/bowen/blog/common/ApiResponse.java`
- 创建：`blog-server/src/main/java/com/bowen/blog/common/GlobalExceptionHandler.java`
- 创建：`blog-server/src/main/java/com/bowen/blog/config/JacksonConfig.java`
- 测试：`blog-server/src/test/java/com/bowen/blog/common/ApiResponseTest.java`
- 测试：`blog-server/src/test/java/com/bowen/blog/common/GlobalExceptionHandlerTest.java`

- [ ] 第 1 步：先写响应包装和异常处理的失败测试
- [ ] 第 2 步：运行定向测试，确认失败
- [ ] 第 3 步：实现最小共享响应与异常处理类
- [ ] 第 4 步：重跑测试，确认通过
- [ ] 第 5 步：提交

## 任务 3：创建数据库 Schema 脚本

**文件：**
- 创建：`sql/001_schema.sql`
- 创建：`sql/002_seed_admin.sql`
- 文档：`docs/testing-strategy.md`

- [ ] 第 1 步：编写 `admin_user`、`post`、`category`、`tag`、`post_tag`、`site_config`、`upload_file` 的表结构
- [ ] 第 2 步：补单管理员和最小站点配置种子数据
- [ ] 第 3 步：说明本地与集成测试如何使用 Schema
- [ ] 第 4 步：人工校验表结构与设计文档一致
- [ ] 第 5 步：提交

## 任务 4：实现认证模块并补单元测试

**文件：**
- 创建：`blog-server/src/main/java/com/bowen/blog/config/SecurityConfig.java`
- 创建：`blog-server/src/main/java/com/bowen/blog/security/JwtTokenProvider.java`
- 创建：`blog-server/src/main/java/com/bowen/blog/security/JwtAuthenticationFilter.java`
- 创建：`blog-server/src/main/java/com/bowen/blog/auth/entity/AdminUser.java`
- 创建：`blog-server/src/main/java/com/bowen/blog/auth/mapper/AdminUserMapper.java`
- 创建：`blog-server/src/main/java/com/bowen/blog/auth/dto/LoginRequest.java`
- 创建：`blog-server/src/main/java/com/bowen/blog/auth/vo/LoginResponse.java`
- 创建：`blog-server/src/main/java/com/bowen/blog/auth/service/AdminAuthService.java`
- 创建：`blog-server/src/main/java/com/bowen/blog/auth/controller/AdminAuthController.java`
- 测试：`blog-server/src/test/java/com/bowen/blog/auth/service/AdminAuthServiceTest.java`
- 测试：`blog-server/src/test/java/com/bowen/blog/auth/controller/AdminAuthControllerTest.java`

- [ ] 第 1 步：先写有效和无效登录的 Service 失败测试
- [ ] 第 2 步：补 `/api/admin/login` 的 Controller 失败测试
- [ ] 第 3 步：运行认证测试，确认失败
- [ ] 第 4 步：补最小认证实现
- [ ] 第 5 步：重跑认证测试，确认通过
- [ ] 第 6 步：提交

## 任务 5 至任务 21

后续任务继续按同样原则推进：

- 分类模块
- 标签模块
- 站点配置模块
- Markdown 渲染模块
- 文章模块
- 上传模块
- 阅读量模块
- 前端测试工具
- 前端 API 层
- 前端公共工具
- 组件重构
- 首页数据流
- 文章详情数据流
- 移除前端旧 Mock 结构
- 后端集成测试
- 部署文件
- 全量验证

每个任务都必须遵守：

- 先测后写
- 只跑最小必要测试
- 模块通过后再进入下一个任务

## 后端单元测试标准

使用：

- JUnit 5
- Mockito
- AssertJ

规则：

- Service 测试 Mock 掉 Mapper 依赖
- Controller 测试使用 `MockMvc`
- 每个 Service 模块都要覆盖成功、校验失败、未找到三类路径

## 前端单元测试标准

使用：

- Vitest
- React Testing Library

规则：

- API 测试 Mock `fetch`
- 页面测试验证渲染行为，而不是实现细节
- TOC 工具测试覆盖 Markdown 标题边界情况

## 最终集成测试标准

使用：

- Spring Boot Test
- MySQL Testcontainers

规则：

- 不 Mock 数据库
- 只注入最小必要种子数据
- 覆盖从发布到读取的真实链路

## 执行说明

- 每个后端模块和每个带业务逻辑的前端行为都遵循 TDD。
- 后端契约未稳定前，不做前端真实 API 接入。
- 首页整合完成后，不保留旧的 `/blog` 公网路由。
- 修复当前前端里的乱码占位文本，但不改变整体视觉语言。

## 评审限制

当前环境未显式授权子代理并行评审，因此本计划默认由单代理按规格文档和测试要求自审执行。
