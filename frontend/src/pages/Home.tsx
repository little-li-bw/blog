import * as React from 'react';
import { motion } from 'motion/react';
import { ArrowRight, Download } from 'lucide-react';
import BlogCard from '../components/BlogCard';
import { getPosts } from '../api/posts';
import { getCategories, getSiteConfig } from '../api/site';
import { splitSkillText } from '../lib/format';
import type { Category, PostListItem, SiteConfig } from '../types';

export default function Home() {
  const [siteConfig, setSiteConfig] = React.useState<SiteConfig | null>(null);
  const [posts, setPosts] = React.useState<PostListItem[]>([]);
  const [categories, setCategories] = React.useState<Category[]>([]);
  const [keyword, setKeyword] = React.useState('');
  const [selectedCategoryId, setSelectedCategoryId] = React.useState<number | 'all'>('all');
  const [selectedTag, setSelectedTag] = React.useState<string>('all');
  const [loading, setLoading] = React.useState(true);
  const [error, setError] = React.useState('');

  React.useEffect(() => {
    let cancelled = false;

    Promise.all([getSiteConfig(), getCategories(), getPosts()])
      .then(([site, categoryList, postList]) => {
        if (cancelled) {
          return;
        }

        setSiteConfig(site);
        setCategories(categoryList);
        setPosts(postList);
      })
      .catch((err) => {
        if (!cancelled) {
          setError(err instanceof Error ? err.message : 'Failed to load home page data');
        }
      })
      .finally(() => {
        if (!cancelled) {
          setLoading(false);
        }
      });

    return () => {
      cancelled = true;
    };
  }, []);

  const tags = React.useMemo(
    () => ['all', ...new Set(posts.flatMap((post) => post.tags))],
    [posts],
  );

  const filteredPosts = React.useMemo(() => {
    return posts.filter((post) => {
      const matchesKeyword = post.title.toLowerCase().includes(keyword.toLowerCase());
      const matchesCategory = selectedCategoryId === 'all' || post.categoryId === selectedCategoryId;
      const matchesTag = selectedTag === 'all' || post.tags.includes(selectedTag);
      return matchesKeyword && matchesCategory && matchesTag;
    });
  }, [keyword, posts, selectedCategoryId, selectedTag]);

  const skillGroups = siteConfig
    ? [
        { label: '后端', items: splitSkillText(siteConfig.skillsBackend) },
        { label: '前端', items: splitSkillText(siteConfig.skillsFrontend) },
        { label: '数据库', items: splitSkillText(siteConfig.skillsDatabase) },
        { label: '工具部署', items: splitSkillText(siteConfig.skillsTools) },
      ]
    : [];

  return (
    <div className="space-y-40 pb-20">
      <section className="max-w-7xl mx-auto px-6 pt-12 text-center md:pt-32">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5 }}
          className="inline-block px-4 py-1.5 mb-8 bg-gradient-to-r from-slate-700 to-slate-800 text-white text-[10px] font-black tracking-[0.2em]"
        >
          校招求职 / 技术沉淀
        </motion.div>

        <motion.h1
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1, duration: 0.6 }}
          className="text-7xl md:text-[8rem] lg:text-[10rem] font-black text-slate-900 mb-8 tracking-tighter leading-none"
        >
          {siteConfig?.siteName || 'Java 技术博客'}
          <span className="text-slate-200">.</span>
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2, duration: 0.6 }}
          className="max-w-2xl mx-auto text-xl text-slate-500 mb-6 leading-relaxed font-medium"
        >
          {siteConfig?.heroTitle || 'Java Backend Developer'}
        </motion.p>

        <motion.p
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.25, duration: 0.6 }}
          className="max-w-2xl mx-auto text-lg text-slate-500 mb-16 leading-relaxed font-medium"
        >
          {siteConfig?.heroSubtitle || 'Programming notes and technical practice'}
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3, duration: 0.6 }}
          className="flex flex-col sm:flex-row items-center justify-center gap-6"
        >
          <a
            href="#posts"
            className="w-full sm:w-auto px-10 py-5 bg-gradient-to-r from-slate-800 to-slate-900 text-white font-black uppercase text-xs tracking-widest rounded-none hover:from-slate-700 hover:to-slate-800 transition-all duration-300 flex items-center justify-center gap-3"
          >
            查看文章
            <ArrowRight className="w-4 h-4" />
          </a>
          <a
            href={siteConfig?.resumeUrl || '#'}
            target="_blank"
            rel="noopener noreferrer"
            className="w-full sm:w-auto px-10 py-5 border-[3px] border-slate-900 text-slate-900 font-black uppercase text-xs tracking-widest rounded-none hover:bg-slate-900 hover:text-white transition-all duration-300 flex items-center justify-center gap-3"
          >
            下载简历
            <Download className="w-4 h-4" />
          </a>
        </motion.div>
      </section>

      <section className="max-w-7xl mx-auto px-6 grid grid-cols-1 lg:grid-cols-12 gap-16 items-start pb-32">
        <div className="lg:col-span-4 space-y-12 shrink-0 lg:sticky lg:top-32">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="space-y-6"
          >
            <div className="text-slate-900 font-black tracking-widest text-[10px] uppercase border-b-2 border-slate-900 pb-2 inline-block">
              / 关于我
            </div>
            <p className="text-sm text-slate-500 leading-relaxed font-medium">{siteConfig?.aboutMe || '加载中...'}</p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="space-y-6"
          >
            <div className="text-slate-900 font-black tracking-widest text-[10px] uppercase border-b-2 border-slate-900 pb-2 inline-block">
              / 技术栈
            </div>
            <div className="space-y-6 pt-2">
              {skillGroups.map((group) => (
                <div key={group.label} className="space-y-3">
                  <div className="text-xs font-black text-slate-700">{group.label}</div>
                  <div className="flex flex-wrap gap-2">
                    {group.items.map((item) => (
                      <span key={item} className="px-2 py-1 bg-slate-100 text-[10px] font-bold text-slate-600 rounded-md">
                        {item}
                      </span>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </motion.div>
        </div>

        <div id="posts" className="lg:col-span-8 space-y-12">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-6 border-b-2 border-slate-100 pb-6">
            <div className="space-y-2">
              <div className="text-slate-900 font-black tracking-widest uppercase text-xs">/ 技术博客</div>
              <h2 className="text-4xl font-black text-slate-900 tracking-tighter uppercase">最新文章</h2>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <input
              value={keyword}
              onChange={(event) => setKeyword(event.target.value)}
              placeholder="搜索文章标题"
              className="h-12 px-4 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:border-slate-900"
            />
            <select
              value={selectedCategoryId}
              onChange={(event) => setSelectedCategoryId(event.target.value === 'all' ? 'all' : Number(event.target.value))}
              className="h-12 px-4 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:border-slate-900"
            >
              <option value="all">全部分类</option>
              {categories.map((category) => (
                <option key={category.id} value={category.id}>
                  {category.name}
                </option>
              ))}
            </select>
            <select
              value={selectedTag}
              onChange={(event) => setSelectedTag(event.target.value)}
              className="h-12 px-4 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:border-slate-900"
            >
              {tags.map((tag) => (
                <option key={tag} value={tag}>
                  {tag === 'all' ? '全部标签' : tag}
                </option>
              ))}
            </select>
          </div>

          {loading ? <p className="text-slate-500">正在加载首页内容...</p> : null}
          {error ? <p className="text-red-600">{error}</p> : null}

          {!loading && !error ? (
            filteredPosts.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {filteredPosts.map((post) => (
                  <BlogCard key={post.id} post={post} />
                ))}
              </div>
            ) : (
              <div className="py-20 text-center text-slate-500 font-medium">没有找到符合条件的文章。</div>
            )
          ) : null}
        </div>
      </section>
    </div>
  );
}
