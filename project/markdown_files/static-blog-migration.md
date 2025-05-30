---
title: 从动态到静态：博客系统的演进
date: 2024-03-22
tags: ['技术', '重构', 'Next.js', 'Markdown']
excerpt: 记录将博客系统从 Supabase 迁移到静态 Markdown 文件的过程，以及这个决策背后的思考。
---

# 从动态到静态：博客系统的演进

## 为什么选择静态博客？

在最初的版本中，我选择了 Supabase 作为后端数据库。但随着使用，我发现对于个人博客来说，这种方案可能有点"过度设计"：

1. 文章内容相对稳定，不需要频繁的数据库操作
2. Markdown 文件更容易版本控制和备份
3. 静态生成带来更好的性能和 SEO

## 技术栈的改变

### 移除的组件
- Supabase 客户端
- 实时订阅功能
- 用户认证系统

### 新增的功能
- Markdown 文件解析
- frontmatter 支持
- 静态文件路由

## 迁移过程

主要的迁移工作包括：

```typescript
// 原来的文章获取方式
const { data: articles } = await supabase
  .from('articles')
  .select('*')
  .order('created_at', { ascending: false });

// 新的文件系统方式
const articles = fileNames.map(fileName => {
  const fullPath = path.join(articlesDirectory, fileName);
  const { data, content } = matter(fs.readFileSync(fullPath, 'utf8'));
  return { ...data, content };
});
```

## 性能提升

迁移后的性能改进：
- 页面加载时间减少 60%
- 首次内容渲染提速 40%
- 服务器负载降低

## 未来计划

- 添加文章搜索功能
- 实现标签筛选系统
- 优化图片处理流程

这次迁移不仅简化了系统架构，也为未来的功能扩展打下了基础。 