import { Calendar, ArrowRight } from 'lucide-react';
import { motion } from 'motion/react';
import { Link } from 'react-router-dom';
import type { PostListItem } from '../types';
import { formatDate } from '../lib/format';

export default function BlogCard({ post }: { post: PostListItem }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      className="group bg-white rounded-2xl border border-slate-200 p-8 hover:border-slate-400 hover:shadow-xl hover:shadow-slate-200/50 transition-all duration-300 h-full flex flex-col"
    >
      <div className="flex flex-wrap items-center gap-4 text-[10px] font-bold uppercase tracking-widest text-slate-400 mb-6">
        <span className="flex items-center gap-1.5 px-3 py-1 bg-slate-50 rounded-lg text-slate-900 border border-slate-100">
          <Calendar className="w-3 h-3" />
          {formatDate(post.publishTime)}
        </span>
        <span className="flex items-center gap-1.5 px-3 py-1 bg-slate-50 rounded-lg border border-slate-100">
          {post.categoryName}
        </span>
      </div>

      <h3 className="text-xl font-black text-slate-900 leading-tight mb-4">
        <Link to={`/blog/${post.id}`}>{post.title}</Link>
      </h3>

      <p className="text-slate-500 text-sm line-clamp-2 md:line-clamp-3 mb-6 leading-relaxed flex-grow">
        {post.summary}
      </p>

      <div className="flex flex-wrap gap-2 mb-8">
        {post.tags.map((tag) => (
          <span key={tag} className="px-2 py-1 bg-slate-100 text-[10px] font-bold text-slate-600 rounded-md">
            {tag}
          </span>
        ))}
      </div>

      <div className="pt-8 border-t border-slate-100 flex items-center justify-between mt-auto">
        <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">
          {post.viewCount} 次阅读
        </span>
        <Link
          to={`/blog/${post.id}`}
          className="inline-flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-slate-900 group/link"
        >
          查看全文
          <ArrowRight className="w-3 h-3 group-hover/link:translate-x-1 transition-transform" />
        </Link>
      </div>
    </motion.div>
  );
}
