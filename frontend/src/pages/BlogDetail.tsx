import * as React from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import Markdown from 'react-markdown';
import { motion } from 'motion/react';
import { Calendar, Tag, Eye, ChevronLeft, Share2, Printer, Copy, Check } from 'lucide-react';
import { BLOG_POSTS } from '../constants';
import { cn } from '../lib/utils';

export default function BlogDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [copied, setCopied] = React.useState(false);
  
  const postIndex = BLOG_POSTS.findIndex(p => p.id === id);
  const post = BLOG_POSTS[postIndex];
  const prevPost = postIndex > 0 ? BLOG_POSTS[postIndex - 1] : null;
  const nextPost = postIndex < BLOG_POSTS.length - 1 ? BLOG_POSTS[postIndex + 1] : null;

  if (!post) {
    return (
      <div className="max-w-7xl mx-auto px-6 py-32 text-center space-y-8">
        <h2 className="text-4xl font-black text-slate-900 uppercase tracking-tighter italic">404 - 文章不存在</h2>
        <Link to="/blog" className="px-8 py-3 bg-gradient-to-r from-slate-800 to-slate-900 text-white font-black uppercase text-xs tracking-widest inline-block">返回列表</Link>
      </div>
    );
  }

  const handleCopy = () => {
     setCopied(true);
     setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 lg:grid-cols-12 gap-16 py-12">
      {/* Article Content */}
      <article className="lg:col-span-8 space-y-16">
        {/* Header */}
        <div className="space-y-10 pb-12 border-b-2 border-slate-100">
          <button 
             onClick={() => navigate(-1)}
             className="inline-flex items-center gap-2 text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 hover:text-slate-900 transition-colors group"
          >
             <ChevronLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
             返回列表
          </button>

          <motion.h1 
             initial={{ opacity: 0, y: 20 }}
             animate={{ opacity: 1, y: 0 }}
             className="text-5xl md:text-7xl font-black text-slate-900 tracking-tighter leading-[0.9] uppercase"
          >
            {post.title}
          </motion.h1>

          <div className="flex flex-wrap items-center gap-8 text-[10px] font-black uppercase tracking-widest text-slate-400">
             <span className="flex items-center gap-2 px-3 py-1 bg-slate-50 text-slate-900 border border-slate-200">
                <Calendar className="w-4 h-4" />
                {post.date}
             </span>
             <span className="flex items-center gap-2">
                <Tag className="w-4 h-4" />
                {post.category}
             </span>
             <span className="flex items-center gap-2">
                <Eye className="w-4 h-4" />
                {post.views} 次阅读
             </span>
          </div>
        </div>

        {/* Markdown Text */}
        <div className="prose prose-slate prose-lg max-w-none 
          prose-headings:text-slate-900 prose-headings:font-black prose-headings:uppercase prose-headings:tracking-tighter
          prose-p:text-slate-600 prose-p:leading-[1.8] prose-p:font-medium
          prose-a:text-slate-900 prose-a:font-black prose-a:no-underline prose-strong:text-slate-900
          prose-code:text-slate-900 prose-code:bg-slate-100 prose-code:px-2 prose-code:py-0.5 prose-code:rounded-none prose-code:font-black
          prose-pre:bg-slate-900 prose-pre:p-0 prose-pre:rounded-none prose-blockquote:border-l-4 prose-blockquote:border-slate-800 prose-blockquote:bg-slate-50 prose-blockquote:py-2 prose-blockquote:px-8 prose-blockquote:italic">
          <Markdown
            components={{
              pre: ({ children }) => (
                <div className="relative group/code my-12">
                  <div className="absolute right-6 top-6 z-10 opacity-0 group-hover/code:opacity-100 transition-opacity">
                    <button 
                       onClick={handleCopy}
                       className="p-3 rounded-none bg-white text-slate-900 hover:bg-slate-800 hover:text-white transition-all border border-slate-800 shadow-[4px_4px_0px_0px_rgba(30,41,59,1)] active:shadow-none active:translate-x-1 active:translate-y-1"
                    >
                      {copied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                    </button>
                  </div>
                  <pre className="!m-0 !p-10 overflow-x-auto scrollbar-thin scrollbar-thumb-slate-700 font-mono text-sm leading-relaxed">
                    {children}
                  </pre>
                </div>
              )
            }}
          >
            {post.content}
          </Markdown>
        </div>

        {/* Pagination */}
        <div className="pt-20 border-t-2 border-slate-100 grid grid-cols-1 md:grid-cols-2 gap-8">
           {prevPost ? (
             <Link 
               to={`/blog/${prevPost.id}`}
               className="p-8 border-2 border-slate-800 hover:bg-slate-800 hover:text-white transition-all group flex flex-col items-start gap-4"
             >
                <div className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-slate-400 group-hover:text-white/50 transition-colors">
                   <ChevronLeft className="w-4 h-4" />
                   上一篇
                </div>
                <span className="text-xl font-black uppercase tracking-tighter line-clamp-1">{prevPost.title}</span>
             </Link>
           ) : <div />}

           {nextPost ? (
             <Link 
               to={`/blog/${nextPost.id}`}
               className="p-8 border-2 border-slate-800 hover:bg-slate-800 hover:text-white transition-all group flex flex-col items-end gap-4 text-right"
             >
                <div className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-slate-400 group-hover:text-white/50 transition-colors">
                   下一篇
                   <ChevronLeft className="w-4 h-4 rotate-180" />
                </div>
                <span className="text-xl font-black uppercase tracking-tighter line-clamp-1">{nextPost.title}</span>
             </Link>
           ) : <div />}
        </div>
      </article>

      {/* Sidebar / TOC */}
      <aside className="lg:col-span-4 space-y-12">
        <div className="sticky top-32 space-y-12">
          <div className="bg-white border-l-[10px] border-slate-800 p-10 space-y-10">
            <h3 className="text-xs font-black text-slate-900 uppercase tracking-[0.2em] flex items-center gap-3 italic">
               / 目录导航
            </h3>
            <ul className="space-y-6">
               {['背景介绍', '核心原理', '代码实现', '总结'].map((item, i) => (
                 <li key={i}>
                   <a 
                     href={`#${item}`} 
                     className={cn(
                       "text-xs font-black uppercase tracking-widest transition-all block",
                       i === 1 ? "text-slate-900 translate-x-4 border-l-4 border-slate-800 pl-4" : "text-slate-400 hover:text-slate-900 hover:pl-4"
                     )}
                   >
                     {item}
                   </a>
                 </li>
               ))}
            </ul>
          </div>

          <div className="bg-gradient-to-br from-slate-800 to-slate-900 p-10 text-white space-y-8 relative overflow-hidden group">
             <div className="absolute top-0 right-0 p-4 text-white/5 font-black text-7xl select-none pointer-events-none group-hover:scale-110 transition-transform duration-700">
               互动
             </div>
             <h3 className="text-xl font-black uppercase tracking-tighter border-b border-white/10 pb-4">本文是否有帮助？</h3>
             <p className="text-slate-400 text-sm leading-relaxed font-medium">
               如果这篇文章解决了你的问题，欢迎分享给更多需要的小伙伴。
             </p>
             <div className="flex gap-4">
                <button className="flex-grow flex items-center justify-center gap-3 py-4 bg-white text-slate-900 font-black uppercase text-xs tracking-widest hover:bg-slate-200 transition-all">
                   <Share2 className="w-4 h-4" />
                   分享
                </button>
                <button className="p-4 border border-white/20 hover:border-white transition-all">
                   <Printer className="w-5 h-5" />
                </button>
             </div>
          </div>
        </div>
      </aside>
    </div>
  );
}
