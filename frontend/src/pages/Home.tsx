import * as React from 'react';
import { motion } from 'motion/react';
import { ArrowRight, Download, Server, Database, Code, Wrench } from 'lucide-react';
import { BLOG_POSTS } from '../constants';
import BlogCard from '../components/BlogCard';
import { Link } from 'react-router-dom';

export default function Home() {
  const featuredPosts = BLOG_POSTS.filter(post => post.isFeatured);

  return (
    <div className="space-y-40 pb-20">
      {/* Hero Section */}
      <section className="max-w-7xl mx-auto px-6 pt-12 text-center md:pt-32">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5 }}
          className="inline-block px-4 py-1.5 mb-8 bg-gradient-to-r from-slate-700 to-slate-800 text-white text-[10px] font-black tracking-[0.2em]"
        >
          应届生求职 / 学习思考
        </motion.div>
        
        <motion.h1
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1, duration: 0.6 }}
          className="text-7xl md:text-[8rem] lg:text-[10rem] font-black text-slate-900 mb-8 tracking-tighter leading-none"
        >
          Java技术博客 <span className="text-slate-200">.</span>
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2, duration: 0.6 }}
          className="max-w-2xl mx-auto text-xl text-slate-500 mb-16 leading-relaxed font-medium"
        >
          记录平时学习 Java 后端开发的知识沉淀与项目实践。热爱编程与开源，目前正积极寻找校招/实习机会。
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3, duration: 0.6 }}
          className="flex flex-col sm:flex-row items-center justify-center gap-6"
        >
          <Link to="/blog" className="w-full sm:w-auto px-10 py-5 bg-gradient-to-r from-slate-800 to-slate-900 text-white font-black uppercase text-xs tracking-widest rounded-none hover:from-slate-700 hover:to-slate-800 transition-all duration-300 flex items-center justify-center gap-3">
            浏览技术专栏
            <ArrowRight className="w-4 h-4" />
          </Link>
          <button className="w-full sm:w-auto px-10 py-5 border-[3px] border-slate-900 text-slate-900 font-black uppercase text-xs tracking-widest rounded-none hover:bg-slate-900 hover:text-white transition-all duration-300 flex items-center justify-center gap-3">
            下载个人简历
            <Download className="w-4 h-4" />
          </button>
        </motion.div>
      </section>

      {/* Combined Content Section */}
      <section className="max-w-7xl mx-auto px-6 grid grid-cols-1 lg:grid-cols-12 gap-16 items-start pb-32">
        {/* Left Column: Intro & Tech Stack (Small Portion) */}
        <div className="lg:col-span-4 space-y-12 shrink-0 lg:sticky lg:top-32">
          {/* About Me */}
          <motion.div
             initial={{ opacity: 0, y: 30 }}
             whileInView={{ opacity: 1, y: 0 }}
             viewport={{ once: true }}
             className="space-y-6"
          >
            <div className="text-slate-900 font-black tracking-widest text-[10px] uppercase border-b-2 border-slate-900 pb-2 inline-block">
              / 个人简介
            </div>
            <p className="text-sm text-slate-500 leading-relaxed font-medium">
              你好，我是 <strong className="text-slate-800">你的名字 (Bowen)</strong>，一名即将步入职场的计算机专业应届生。对写代码充满热情，喜欢钻研技术细节。
            </p>
            <div className="bg-slate-50 p-6 border-l-[4px] border-slate-800 text-sm text-slate-600 leading-relaxed font-medium">
               在校期间积累了扎实的 Java 基础与主流框架开发经验，具备独立开发完整 Web 项目的能力。喜欢分享技术，保持持续学习的习惯。
            </div>
          </motion.div>

          {/* Tech Stack */}
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
              {[
                { label: '编程语言与框架', items: ['Java', 'Spring Boot', 'Spring MVC', 'MyBatis'] },
                { label: '数据库与缓存', items: ['MySQL', 'Redis'] },
                { label: '开发与部署工具', items: ['Git', 'Maven', 'Linux', 'Docker'] }
              ].map(box => (
                <div key={box.label} className="space-y-3">
                  <div className="text-xs font-black text-slate-700">{box.label}</div>
                  <div className="flex flex-wrap gap-2">
                    {box.items.map(t => (
                      <span key={t} className="px-2 py-1 bg-slate-100 text-[10px] font-bold text-slate-600 rounded-md">
                        {t}
                      </span>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </motion.div>
        </div>

        {/* Right Column: Blogs (Large Portion) */}
        <div className="lg:col-span-8 space-y-12">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-6 border-b-2 border-slate-100 pb-6">
             <div className="space-y-2">
                <div className="text-slate-900 font-black tracking-widest uppercase text-xs">
                  / 技术专栏
                </div>
                <h2 className="text-4xl font-black text-slate-900 tracking-tighter uppercase">近期文章</h2>
             </div>
             <Link to="/blog" className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-900 border-b-2 border-slate-900 pb-1 hover:text-slate-500 hover:border-slate-500 transition-all">
                浏览全部分类
             </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
             {BLOG_POSTS.slice(0, 4).map(post => (
               <BlogCard key={post.id} post={post} />
             ))}
          </div>
        </div>
      </section>
    </div>
  );
}
