import { BlogPost, Project } from './types';

export const BLOG_POSTS: BlogPost[] = [
  {
    id: '1',
    title: 'Spring Boot 整合 Redis 实现分布式锁',
    summary: '本文介绍了在高并发场景下，如何基于 Redis 实现可靠的分布式锁，并解决了锁超时与误删问题...',
    content: `
# Spring Boot 整合 Redis 实现分布式锁

在高并发业务场景中，分布式锁是保证数据一致性的重要手段。

## 1. 为什么需要分布式锁？
在单机环境下，我们可以使用 Java 原生的 \`synchronized\` 或 \`ReentrantLock\`。但在分布式集群环境下，这些 JVM 级别的锁无法跨进程工作。

## 2. 基于 Redis 的实现原理
核心操作是 \`SET key value NX PX milliseconds\`。

\`\`\`java
public boolean tryLock(String lockKey, String requestId, int expireTime) {
    return redisTemplate.opsForValue().setIfAbsent(lockKey, requestId, expireTime, TimeUnit.MILLISECONDS);
}
\`\`\`

## 3. 常见问题解决
### 3.1 锁超时与续期
如果业务执行时间超过了锁的过期时间，会导致锁被自动释放。可以使用 Redisson 的看门狗机制自动续期。

### 3.2 误删锁
为了防止线程 A 删除了线程 B 的锁，删除时需要校验 requestId。

\`\`\`lua
if redis.call('get', KEYS[1]) == ARGV[1] then
    return redis.call('del', KEYS[1])
else
    return 0
end
\`\`\`

## 4. 总结
Redis 分布式锁实现简单且性能高，但在极端的 Redis 集群故障场景下（如主从切换），可能存在安全性问题，此时可以考虑使用 Redlock 或 Zookeeper。
    `,
    date: '2026-04-15',
    category: '后端开发',
    tags: ['Spring Boot', 'Redis', '分布式'],
    readTime: '8 min',
    views: 342,
    isFeatured: true,
  },
  {
    id: '2',
    title: 'MySQL 索引优化实践',
    summary: '通过对实际项目中的慢查询进行分析，探讨 B+ 树索引的工作原理及优化策略，助力系统性能提升。',
    content: '# MySQL 索引优化实践...',
    date: '2026-04-10',
    category: '数据库',
    tags: ['MySQL', '性能优化'],
    readTime: '12 min',
    views: 528,
  },
  {
    id: '3',
    title: 'Vue 3 组合式 API 深度解析',
    summary: '从 Options API 到 Composition API，了解 Vue 3 如何通过更加灵活的自定义 Hook 实现逻辑复用。',
    content: '# Vue 3 组合式 API 深度解析...',
    date: '2026-04-05',
    category: '前端开发',
    tags: ['Vue 3', 'TypeScript'],
    readTime: '10 min',
    views: 215,
  },
  {
    id: '4',
    title: 'Java 17 新特性深度解析',
    summary: 'Sealed Classes, Records, Pattern Matching... 聊聊为什么要升级到 Java 17。',
    content: '# Java 17 新特性深度解析...',
    date: '2026-03-28',
    category: '后端开发',
    tags: ['Java', 'New Features'],
    readTime: '15 min',
    views: 780,
    isFeatured: true,
  },
];

export const PROJECTS: Project[] = [
  {
    id: '1',
    name: '企业级通用权限管理系统',
    description: '为企业内部管理系统提供的一套开箱即用的 RBAC 动态权限管理解决方案。',
    techStack: ['Java', 'Spring Security', 'Vue3', 'MySQL', 'Redis'],
    responsibilities: [
      '独立设计并实现了基于角色的动态路由权限分配模块。',
      '负责引入 Redis 缓存用户权限树，将权限校验接口的响应时间降低了 50%。',
    ],
    highlights: [
      '实现了细粒度到按钮级别的权限控制。',
      '采用 JWT 实现无状态登录与 Token 续签机制。',
    ],
    githubUrl: 'https://github.com/example/auth-system',
    demoUrl: 'https://demo.example.com',
    imageUrl: 'https://picsum.photos/seed/auth/800/400',
    date: '2025-12',
  },
  {
    id: '2',
    name: '电商订单处理系统',
    description: '基于微服务架构的高并发订单处理系统，解决了双十一期间的海量订单堆积问题。',
    techStack: ['Spring Cloud', 'Redis', 'RabbitMQ', 'MySQL'],
    responsibilities: [
      '负责消息队列的高可用配置，确保订单消息不丢失。',
      '优化了数据库连接池配置，提升了整体吞吐量。',
    ],
    highlights: [
      '使用 RabbitMQ 实现异步削峰，成功应对了 10 倍日常流量。',
      '实现了分布式事务的一致性保障（Seata）。',
    ],
    githubUrl: 'https://github.com/example/order-system',
    imageUrl: 'https://picsum.photos/seed/order/800/400',
    date: '2025-08',
  },
];
