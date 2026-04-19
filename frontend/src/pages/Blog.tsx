import * as React from 'react';
import { motion } from 'motion/react';
import { Search, Filter, ChevronRight } from 'lucide-react';
import { BLOG_POSTS } from '../constants';
import BlogCard from '../components/BlogCard';

export default function Blog() {
  const [searchQuery, setSearchQuery] = React.useState('');
  const [selectedCategory, setSelectedCategory] = React.useState('All');

  const filteredPosts = BLOG_POSTS.filter(post => {
    const matchesSearch = post.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
                         post.summary.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = selectedCategory === 'All' || post.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const categories = ['All', ...new Set(BLOG_POSTS.map(p => p.category))];

  return (
    <div className="max-w-7xl mx-auto px-6 space-y-16 py-12">
      {/* Header */}
      <section className="space-y-6">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="inline-block px-3 py-1 bg-gradient-to-r from-slate-700 to-slate-800 text-white text-[10px] font-black uppercase tracking-widest"
        >
          技术专栏
        </motion.div>
        <motion.h1 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-5xl md:text-7xl font-black text-slate-900 tracking-tighter"
        >
          技术博客 <span className="text-slate-300">/</span>
        </motion.h1>
        <motion.p 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="max-w-2xl text-xl text-slate-500 leading-relaxed font-medium"
        >
          在这里我分享关于 Java 后端开发、分布式系统以及工程实践的思考与心得。
        </motion.p>
      </section>

      {/* Filter Bar */}
      <section className="flex flex-col md:flex-row gap-4 border-b border-slate-200 pb-12">
        <div className="relative flex-grow group">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 group-focus-within:text-slate-900 transition-colors" />
          <input 
            type="text" 
            placeholder="搜索文章标题..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-12 pr-4 h-14 bg-slate-50 border border-slate-200 rounded-xl focus:ring-4 focus:ring-slate-900/5 focus:border-slate-900 transition-all outline-none font-medium text-slate-900"
          />
        </div>
        <div className="relative group min-w-[200px]">
          <Filter className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 group-focus-within:text-slate-900 transition-colors" />
          <select 
            className="w-full pl-12 pr-10 h-14 bg-slate-50 border border-slate-200 rounded-xl focus:ring-4 focus:ring-slate-900/5 focus:border-slate-900 transition-all outline-none appearance-none font-bold text-slate-700 uppercase text-xs tracking-widest"
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
          >
             {categories.map(c => <option key={c} value={c}>{c === 'All' ? '全部分类' : c}</option>)}
          </select>
          <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none">
            <ChevronRight className="w-4 h-4 text-slate-400 rotate-90" />
          </div>
        </div>
      </section>

      {/* Grid */}
      <section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 pb-32">
        {filteredPosts.length > 0 ? (
          filteredPosts.map(post => (
            <BlogCard key={post.id} post={post} />
          ))
        ) : (
          <div className="col-span-full py-20 text-center space-y-4">
             <div className="text-4xl">🔍</div>
             <p className="text-slate-500 font-medium">没有找到相关文章，换个关键词试试？</p>
          </div>
        )}
      </section>
    </div>
  );
}
