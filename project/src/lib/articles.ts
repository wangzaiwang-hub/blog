import matter from 'gray-matter';
// 移除 fs 和 path 的导入，因为 Vite 的 import.meta.glob 可以在客户端处理
// import fs from 'fs';
// import path from 'path';
import type { StaticArticle, Category } from '../types';
import { format, parseISO } from 'date-fns';

let hasLoggedRawContent = false;

function generateSlug(name: string): string {
  if (!name) return '';
  return name.toLowerCase().replace(/\s+/g, '-').replace(/[^\w-]+/g, '');
} // Module-level variable for one-time logging

// 硬编码文章数据，避免解析Markdown文件
const HARDCODED_ARTICLES: StaticArticle[] = [
  {
    slug: "about-desert-theme",
    title: "沙漠主题设计说明",
    excerpt: "介绍这个博客系统的沙漠主题设计理念，包括配色方案、字体选择和整体布局的考虑。",
    date: "2025-03-21",
    formattedDate: "2025-03-21",
    tags: ["设计", "主题", "UI/UX"],
    categories: [
      { id: "design", name: "设计", slug: "design", description: "", article_count: 1 }
    ],
    content: `# 沙漠主题设计说明

在设计这个博客主题时，我希望能够营造出一种独特的沙漠氛围，同时保持良好的可读性和现代感。

## 配色方案

主题的配色方案主要包括：

- 沙漠色系：温暖的米色和沙褐色
- 赤陶色：作为强调色，体现沙漠中的生命力
- 暗色模式：深灰色调，模拟夜晚的沙漠

## 字体选择

- 标题：使用 ZCOOL KuaiLe，活泼而不失优雅
- 正文：选用 Ma Shan Zheng，提供良好的可读性

## 响应式设计

主题采用移动优先的响应式设计，在不同设备上都能提供良好的阅读体验：

- 移动端：单列布局，重点突出内容
- 平板：优化间距和字体大小
- 桌面端：双列布局，充分利用屏幕空间

## 交互细节

- 平滑的暗色模式切换
- 文章卡片的悬停效果
- 加载动画和过渡效果

这些设计元素共同营造出一个独特而舒适的阅读环境。`
  },
  {
    slug: "hello-world",
    title: "你好，世界！",
    excerpt: "这是我的第一篇博客文章，介绍了这个博客系统支持的一些基本功能和 Markdown 语法。",
    date: "2025-03-20",
    formattedDate: "2025-03-20",
    tags: ["博客", "介绍"],
    categories: [
      { id: "blog", name: "博客", slug: "blog", description: "", article_count: 1 }
    ],
    content: `# 欢迎来到我的博客

这是我的第一篇博客文章。在这里，我将分享我的想法和经验。

## Markdown 支持

这个博客系统支持完整的 Markdown 语法：

### 列表示例

- 项目 1
- 项目 2
- 项目 3

### 代码示例

\`\`\`javascript
function hello() {
  console.log("你好，世界！");
}
\`\`\`

### 引用示例

> 这是一段引用文本。
> 
> -- 某人说

## 结语

感谢访问我的博客！`
  },
  {
    slug: "static-blog-migration",
    title: "从动态到静态：博客系统的演进",
    excerpt: "记录将博客系统从 Supabase 迁移到静态 Markdown 文件的过程，以及这个决策背后的思考。",
    date: "2025-03-24",
    formattedDate: "2025-03-24",
    tags: ["技术", "重构", "Next.js", "Markdown"],
    categories: [
      { id: "tech", name: "技术", slug: "tech", description: "", article_count: 1 }
    ],
    content: `# 从动态到静态：博客系统的演进

最初，这个博客系统是基于 Supabase 构建的，使用了其数据库和认证功能。随着时间的推移，我发现一个静态的解决方案更符合我的需求。

## 为什么选择静态方案？

- **简化部署**：静态博客可以轻松部署到任何静态托管服务
- **更好的性能**：无需数据库查询，页面加载更快
- **更低的维护成本**：不需要担心数据库维护和安全更新
- **版本控制**：所有内容都可以通过 Git 进行版本控制

## 迁移过程

迁移过程包括：

1. 将数据库中的文章导出为 Markdown 文件
2. 调整路由和渲染逻辑以支持静态内容
3. 添加 frontmatter 解析功能
4. 优化构建过程

## 面临的挑战

迁移过程中遇到了一些挑战：

- 确保 URL 结构保持一致，避免链接失效
- 维护原有的标签和分类功能
- 在静态环境中实现搜索功能

## 未来改进

未来计划添加的功能：

- 基于静态文件的搜索功能
- 评论系统（可能使用第三方解决方案）
- 更好的图片优化

这次迁移使博客系统变得更加简单和高效。`
  },
 {
    slug: "49game-introduction",
    title: "根据reddit上最烂音量控制帖子做的一个反人类调音量游戏",
    excerpt: "目前只做了前几关，后面有时间再做，游戏地址：https://49game.wctw.fun",
    date: "2025-05-07",
    formattedDate: "2025-05-07",
    tags: ["reddit", "游戏", "开发"],
    categories: [
      { id: "project", name: "项目", slug: "project", description: "", article_count: 1 }
    ],
    content: `# cozi和Windsurf半个小时做的反人类调音量游戏

## 项目简介

我在reddit上看到一个帖子，说音量控制是最烂的控制，这是很早之前的帖子比赛，看的我笑的合不拢嘴，被大佬们的奇葩想法折服，但是时间久远很多都只剩下了一张动图，我就想用AI技术复刻这些有意思的项目做成游戏来娱乐一下，于是我就做了这个反人类调音量游戏。
![49game主页](/markdown_files/resource/49game1.webp)
![49game主页](/markdown_files/resource/49game2.webp)
![49game主页](/markdown_files/resource/49game3.webp)
## 游戏玩法

游戏玩法很简单，就是根据提示来控制各种形式的音量调节器来调整音量到49，只有在各种反人类音量调节器中精确找到49才能过关，游戏难度会随着关卡的增加而增加，目前只做了前几关，后面有时间再做。
## 技术实现

项目的基层架构是让cozi生成的，本来把整体寄希望于cozi，但是它对游戏每一关的理解做的跟我的预期相差太远了，就把代码下载到本地用Windsurf对每一关的具体玩法进行细致的修改，但是依旧与reddit上大神的项目有些出入。

## 体验地址

体验地址：[49game](https://49game.wctw.fun)

## 未来规划

未来，我计划为49game添加更多功能：

- 添加更多关卡
- 添加更多音量调节器
- 添加更多游戏元素
- 添加更多游戏场景

欢迎访问 [49game](https://49game.wctw.fun) 体验更多有趣的游戏！`
  },
  {
    slug: "wetools-introduction",
    title: "WETools: 效率与创意的数字工具集",
    excerpt: "探索 WETools，一个集合全球免费高效工具的平台，助力提升工作流和数字生活体验。",
    date: "2025-04-25",
    formattedDate: "2025-04-25",
    tags: ["项目", "工具", "效率", "开发"],
    categories: [
      { id: "project", name: "项目", slug: "project", description: "", article_count: 1 }
    ],
    content: `# WETools: 效率与创意的数字工具集

## 项目简介

WE Tools 是我开发的一个集合了全球免费高效工具的平台。这个项目旨在为用户提供一个一站式的工具集合，涵盖办公效率、设计创意、开发编程等多个领域。
![wetools主页](/markdown_files/resource/wetools1.webp)
![wetools主页](/markdown_files/resource/wetools2.webp)
## 核心特点

- **多样化工具集**：目前收集了超过 100 种不同类型的工具
- **分类清晰**：工具按功能和使用场景进行分类，易于查找
- **无需注册**：大多数工具无需注册即可使用
- **响应式设计**：在手机和桌面设备上都能获得良好体验
- **定期更新**：不断增加新工具，淘汰过时工具

## 技术实现

WE Tools 采用了现代化的技术栈：

\`\`\`javascript
// 前端技术栈
const frontendStack = {
  framework: 'React',
  styling: 'Tailwind CSS',
  stateManagement: 'React Context + Hooks',
  routing: 'React Router'
};

// 后端技术栈
const backendStack = {
  storage: 'Supabase',
  deployment: 'Vercel'
};
\`\`\`

## 用户反馈

自发布以来，WE Tools 收到了许多积极的反馈：

> "这个工具集帮我节省了大量寻找合适工具的时间！" - 某用户反馈

## 未来规划

未来，我计划为 WE Tools 添加更多功能：

- 个性化推荐系统
- 工具使用统计和分析
- 社区贡献和评分系统
- 更多本地化内容

欢迎访问 [WE Tools](https://wetools.wctw.fun) 探索更多实用工具！`
  },
 
  {
    slug: "tomydear-onlinestudy-website",
    title: "给我女朋友做的一个在线学习网站",
    excerpt: "用Ai半个小时做的，女朋友说很好用，我也很开心",
    date: "2025-06-03",
    formattedDate: "2025-06-03",
    tags: ["cursor", "cozi", "TypeScript", "学习"],
    categories: [
      { id: "project", name: "项目", slug: "project", description: "", article_count: 1 }
    ],
    content: `# 为她而做 - 给女友的专属学习平台

![学习平台封面](/markdown_files/resource/studyonline1.webp)

## 🌟 项目初衷

这是一个我专为女朋友打造的移动端刷题系统，方便她随时可以在手机端刷她们老师发的题库。整个项目不难，但是整理题库整理成json文件是真的麻烦，几百道题，整理了好久也没弄完，暂时就这些吧，够她背一段时间了。

## 主要功能

### 多样化学习模式
- **顺序模式**：按照预设顺序进行题目练习
- **随机模式**：随机抽取题目，增加学习的挑战性
- **复习模式**：重点复习曾经错误的题目，强化记忆
![学习平台刷题](/markdown_files/resource/studyonline2.webp)

### 个性化学习体验
- **进度追踪**：实时记录学习进度，随时可以继续上次的学习
- **错题收集**：自动收集错题，便于集中复习
- **成绩统计**：直观展示学习成果，帮助找出需要加强的知识点
![学习平台错题](/markdown_files/resource/studyonline3.webp)
![学习平台题集](/markdown_files/resource/studyonline4.webp)

## 技术实现

这个项目我采用我比较熟悉的前端技术栈构建：
- **TypeScript**：提供类型安全的开发体验，减少运行时错误
- **React**：构建用户界面的核心库
- **Vite**：提供极速的开发体验和高效的构建过程
- **Tailwind CSS**：实现快速、响应式的UI设计

## 开发工具

在开发过程中，我主要使用了两款强大的工具：
- **Cursor**：AI辅助编程工具，大大提高了编码效率和代码质量
- **Cozi**：帮助管理项目进度和任务分配，项目大概雏体可以快速完成

## 专为她设计的功能

在设计这个平台时，我特别考虑了她的学习习惯和需求：
1. **个性化学习路径**：根据她的学习进度和薄弱环节调整题目难度
2. **温馨提醒功能**：设置学习提醒，帮助她保持学习动力
3. **成就系统**：完成学习目标后的小奖励，增添学习乐趣
4. **简洁界面**：减少干扰，专注于学习内容

##  为爱定制的内容

根据她的专业和学习需求，我精心准备了以下内容：
- **毛泽东思想和中国特色社会主义理论体系概论**：她当前学期的重点科目
- **个性化错题集**：自动收集她做错的题目，方便复习
- **学习笔记功能**：可以添加自己的理解和记忆方法

##  我们的未来计划

随着她学习需求的变化，这个平台也将不断成长：
- **添加更多她感兴趣的学科**：随着学习进展扩展内容
- **共同学习功能**：创建我们可以一起学习的模块
- **考试倒计时**：为重要考试提供倒计时提醒
- **学习数据分析**：帮助她了解自己的学习模式和进步

##  爱的寄语

宝宝，这个平台承载着我对你学习的支持和对你的爱。希望它能在你备考的日子里，成为你的得力助手。

每当你在这里学习，都是我们共同成长的时刻。无论考试结果如何，我都为你的努力和坚持感到骄傲。

愿这份小小的心意，能照亮你的学习之路，也让你感受到我的陪伴。

体验地址：[studyonline](https://studyonline.wctw.fun)
`
  }
];

// 当用户要添加新文章时，只需在上面的数组中添加一个新对象
// 例如:
/*
  {
    slug: "your-new-article-slug",
    title: "你的新文章标题",
    excerpt: "文章摘要",
    date: "2024-04-01",
    formattedDate: "2024-04-01",
    tags: ["标签1", "标签2"],
    categories: [
      { id: "category-id", name: "分类名称", slug: "category-slug", description: "", article_count: 1 }
    ],
    content: `# 你的新文章标题

正文内容，支持Markdown语法...

## 小标题

- 列表项目
- 另一个列表项目

\`\`\`javascript
// 代码示例
console.log("示例代码");
\`\`\`

更多内容...`
  }
*/

let LOADED_ARTICLES: StaticArticle[] = [];

export async function getArticles(): Promise<StaticArticle[]> {
  console.log('[articles.ts] getArticles called');
  try {
    // 返回硬编码的文章数据
    console.log(`[articles.ts] 返回硬编码的 ${HARDCODED_ARTICLES.length} 篇文章`);
    
    // 按日期降序排序
    const sortedArticles = [...HARDCODED_ARTICLES].sort(
      (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
    );
    return sortedArticles;
  } catch (error) {
    console.error('[articles.ts] Error in getArticles:', error);
    return []; // 出错时返回空数组
  }
}

export async function getArticleBySlug(slug: string): Promise<StaticArticle | undefined> {
  return HARDCODED_ARTICLES.find(article => article.slug === slug);
}

export async function ensureArticlesLoaded(): Promise<StaticArticle[]> {
  console.log('[articles.ts] ensureArticlesLoaded called. LOADED_ARTICLES length:', LOADED_ARTICLES.length);
  if (LOADED_ARTICLES.length === 0) {
    console.log('[articles.ts] LOADED_ARTICLES is empty, calling getArticles...');
    LOADED_ARTICLES = await getArticles();
    console.log('[articles.ts] getArticles finished. LOADED_ARTICLES length:', LOADED_ARTICLES.length, LOADED_ARTICLES.map(a => a.title));
  }
  return LOADED_ARTICLES;
}

export const ARTICLES_SYNC = () => {
  console.log('[articles.ts] ARTICLES_SYNC called. LOADED_ARTICLES length:', LOADED_ARTICLES.length);
  if (LOADED_ARTICLES.length === 0) {
    console.warn("ARTICLES_SYNC accessed before articles are loaded. Call ensureArticlesLoaded() first or use getArticles() for async access.");
    // 因为我们有硬编码的文章，所以可以直接返回它们
    return HARDCODED_ARTICLES;
  }
  return LOADED_ARTICLES;
};

// 示例：在应用启动时或相关组件挂载时预加载文章
// (例如在 main.tsx 或 App.tsx)
// ensureArticlesLoaded().then(() => {
//   console.log("Articles preloaded for synchronous access if needed.");
// }); 