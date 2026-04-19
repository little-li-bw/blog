# 2026-04-19 Post、Upload、Stats 模块评审报告

## 范围

- 新增 `Post` 模块
- 新增 `Upload` 模块
- 新增 `PostView` 阅读量模块
- 调整公开文章接口，补充 `POST /api/posts/{id}/views`
- 新增上传静态资源映射 `UploadResourceConfig`

## 本轮验证命令

```bash
mvn -f blog-server/pom.xml "-Dtest=PostServiceTest,PostTagMapperTest,AdminPostControllerTest,PublicPostControllerTest" test
mvn -f blog-server/pom.xml "-Dtest=UploadServiceTest,UploadControllerTest,PostViewServiceTest,PublicPostControllerTest" test
mvn -f blog-server/pom.xml test
```

## 测试结果

- 后端全量测试：`83`
- 失败：`0`
- 错误：`0`
- 跳过：`0`

## 覆盖率结果

### 本轮模块汇总

- 行覆盖率：`93.12%`
- 分支覆盖率：`67.57%`
- 方法覆盖率：`94.78%`

说明：
- 这轮按“基本功能可用优先”执行，测试集中在主路径，没有继续扩展大量校验失败和边界分支。
- 因此模块级分支覆盖率低于之前的严格阈值，但主功能链路已经跑通。

### 全项目汇总

- 行覆盖率：`93.58%`
- 分支覆盖率：`77.34%`
- 方法覆盖率：`93.36%`

## 代码评审结论

### 无阻塞问题

- `Post` 模块的后台创建、状态流转、前台列表和详情读取主路径可用。
- `Upload` 模块已经补齐本地保存、元数据落库和 `/uploads/**` 静态访问映射，正文图片具备基本可用性。
- `PostView` 模块已经补齐阅读量自增能力，并通过公开接口暴露给前端调用。

### 已知非阻塞项

- [PostService.java](/D:/java/blog/blog-server/src/main/java/com/bowen/blog/post/service/PostService.java)
  - 仍有部分校验失败分支未覆盖，这是当前阶段主动收敛测试范围的结果。
- [UploadService.java](/D:/java/blog/blog-server/src/main/java/com/bowen/blog/upload/service/UploadService.java)
  - 暂未增加文件类型、大小、恶意文件名等防护，当前只满足最小上传能力。
- [BlogServerApplicationTests.java](/D:/java/blog/blog-server/src/test/java/com/bowen/blog/BlogServerApplicationTests.java)
  - 仍使用 `@MockBean`，Spring Boot 3.5 已标记待移除，后续要替换。
- Mockito 在 JDK 21 下仍输出动态 agent 警告，当前不影响测试结果。

## 结论

- 这轮新增的核心后端能力已经可继续支撑前端联调。
- 如果下一轮继续追求开发效率，建议先进入前端 API 对接和页面数据流改造。
- 如果下一轮优先补齐后端质量，可以针对 `PostService` 和 `UploadService` 的失败路径再补一小轮测试，把模块级分支覆盖率抬上来。
