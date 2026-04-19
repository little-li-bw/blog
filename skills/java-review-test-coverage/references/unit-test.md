# Spring Boot 单元测试规范

## 角色定义

作为专业的Java单元测试专家，精通JUnit、Mockito、Spring Test等测试框架，负责系统化地生成和检查代码的单元测试。

## 测试框架

- JUnit 5
- Mockito
- Spring Boot Test

## 测试命名

### 测试类

- 单元测试：`{被测试类名}Test`
- 集成测试：`{被测试类名}IntegrationTest`

### 测试方法

- 推荐：`test{方法名}_{场景}_{结果}`
- `@DisplayName` 使用中文描述测试目的

## 结构模板

### Service层单元测试

```java
@DisplayName("{服务描述}单元测试")
@ExtendWith(MockitoExtension.class)
class XxxServiceTest {
    @Mock
    private XxxRepository xxxRepository;

    @Mock
    private YyyService yyyService;

    @InjectMocks
    private XxxServiceImpl xxxService;

    @BeforeEach
    void setUp() {
        MockitoAnnotations.openMocks(this);
    }

    @Test
    @DisplayName("测试场景描述 - 预期结果")
    void testMethodName_Scenario() {
        // Given
        // When
        // Then
    }
}
```

### Repository/Mapper层集成测试

```java
@ExtendWith(SpringExtension.class)
@SpringBootTest(classes = Application.class)
@Transactional(rollbackFor = Exception.class)
@Rollback
@DisplayName("{Mapper描述}集成测试")
class XxxMapperIntegrationTest {
    @Resource
    private XxxMapper xxxMapper;

    @Test
    @DisplayName("测试场景描述")
    void testMethodName() {
        // Given
        // When
        // Then
    }
}
```

## Given / When / Then

测试必须显式分成：

- Given：准备数据和Mock行为
- When：执行被测方法
- Then：验证结果和交互

## Mock规范

- 优先使用 `@Mock` 和 `@InjectMocks`
- 集成测试可使用 `@SpyBean`
- 需要同时覆盖：
  - 成功返回
  - 返回空值或空集合
  - 抛出异常

常见写法：

```java
when(repository.findById(1L)).thenReturn(Optional.of(entity));
when(repository.save(any())).thenThrow(new RuntimeException("错误"));
doNothing().when(service).send(any());
verify(repository, times(1)).save(any());
verify(service, never()).delete(any());
```

## 断言规范

- 断言不仅要验证非空，还要验证关键字段和值
- 异常路径使用 `assertThrows`
- 多项断言优先使用 `assertAll`
- 对关键协作调用使用 `verify`

## 必测场景

### CRUD

- 成功场景
- 对象不存在
- 参数为 `null`
- 参数校验失败

### 异常处理

- 参数异常
- 业务异常
- 依赖异常

### 边界条件

- 空集合
- 最大值/最小值
- 空字符串
- 临界值

## 组织方式

优先使用 `@Nested` 按场景分组，提升测试可读性。

## 质量要求

- 每个测试独立运行
- 不依赖执行顺序
- 只验证有业务意义的交互
- 测试名和显示名要准确反映场景
