import * as React from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { motion } from 'motion/react';
import { Calendar, Check, ChevronLeft, Copy, Eye, Tag } from 'lucide-react';
import { getPostDetail, incrementPostViews } from '../api/posts';
import { cn } from '../lib/utils';
import { formatDate } from '../lib/format';
import type { PostDetail } from '../types';

interface TocItem {
  id: string;
  text: string;
}

function buildContent(contentHtml: string): { html: string; toc: TocItem[] } {
  const document = new DOMParser().parseFromString(contentHtml, 'text/html');
  const headings = Array.from(document.querySelectorAll('h1, h2, h3'));
  const toc = headings.map((heading, index) => {
    const text = heading.textContent?.trim() || `section-${index + 1}`;
    const id = `heading-${index + 1}`;
    heading.setAttribute('id', id);
    return { id, text };
  });

  return {
    html: document.body.innerHTML,
    toc,
  };
}

export default function BlogDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [post, setPost] = React.useState<PostDetail | null>(null);
  const [viewCount, setViewCount] = React.useState(0);
  const [loading, setLoading] = React.useState(true);
  const [error, setError] = React.useState('');
  const [copied, setCopied] = React.useState(false);

  React.useEffect(() => {
    if (!id) {
      setError('Article not found');
      setLoading(false);
      return;
    }

    let cancelled = false;

    getPostDetail(Number(id))
      .then((detail) => {
        if (cancelled) {
          return;
        }

        setPost(detail);
        setViewCount(detail.viewCount);

        incrementPostViews(Number(id))
          .then((count) => {
            if (!cancelled) {
              setViewCount(count);
            }
          })
          .catch(() => {
            // Keep detail rendering available even if view count update fails.
          });
      })
      .catch((err) => {
        if (!cancelled) {
          setError(err instanceof Error ? err.message : 'Failed to load article');
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
  }, [id]);

  const content = React.useMemo(() => {
    if (!post) {
      return { html: '', toc: [] };
    }
    return buildContent(post.contentHtml);
  }, [post]);

  const handleCopy = async () => {
    if (!post) {
      return;
    }

    await navigator.clipboard?.writeText(post.title);
    setCopied(true);
    window.setTimeout(() => setCopied(false), 2000);
  };

  if (loading) {
    return <div className="max-w-7xl mx-auto px-6 py-32 text-center text-slate-500">正在加载文章...</div>;
  }

  if (error || !post) {
    return (
      <div className="max-w-7xl mx-auto px-6 py-32 text-center space-y-8">
        <h2 className="text-4xl font-black text-slate-900 uppercase tracking-tighter italic">404 - 文章不存在</h2>
        <Link
          to="/"
          className="px-8 py-3 bg-gradient-to-r from-slate-800 to-slate-900 text-white font-black uppercase text-xs tracking-widest inline-block"
        >
          返回首页
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 lg:grid-cols-12 gap-16 py-12">
      <article className="lg:col-span-8 space-y-16">
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
            className="text-5xl md:text-7xl font-black text-slate-900 tracking-tighter leading-[0.9]"
          >
            {post.title}
          </motion.h1>

          <div className="flex flex-wrap items-center gap-8 text-[10px] font-black uppercase tracking-widest text-slate-400">
            <span className="flex items-center gap-2 px-3 py-1 bg-slate-50 text-slate-900 border border-slate-200">
              <Calendar className="w-4 h-4" />
              {formatDate(post.publishTime)}
            </span>
            <span className="flex items-center gap-2">
              <Tag className="w-4 h-4" />
              {post.categoryName}
            </span>
            <span className="flex items-center gap-2">
              <Eye className="w-4 h-4" />
              {viewCount} 次阅读
            </span>
          </div>

          <div className="flex flex-wrap gap-2">
            {post.tags.map((tag) => (
              <span key={tag} className="px-2 py-1 bg-slate-100 text-[10px] font-bold text-slate-600 rounded-md">
                {tag}
              </span>
            ))}
          </div>
        </div>

        <div
          className="prose prose-slate prose-lg max-w-none prose-headings:text-slate-900 prose-headings:font-black prose-p:text-slate-600 prose-p:leading-[1.8] prose-code:text-slate-900 prose-code:bg-slate-100 prose-code:px-2 prose-code:py-0.5 prose-code:rounded-none prose-pre:bg-slate-900 prose-pre:text-white"
          dangerouslySetInnerHTML={{ __html: content.html }}
        />

        <div className="pt-20 border-t-2 border-slate-100 grid grid-cols-1 md:grid-cols-2 gap-8">
          {post.previousPost ? (
            <Link
              to={`/blog/${post.previousPost.id}`}
              className="p-8 border-2 border-slate-800 hover:bg-slate-800 hover:text-white transition-all group flex flex-col items-start gap-4"
            >
              <div className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-slate-400 group-hover:text-white/50 transition-colors">
                <ChevronLeft className="w-4 h-4" />
                上一篇
              </div>
              <span className="text-xl font-black tracking-tighter line-clamp-1">{post.previousPost.title}</span>
            </Link>
          ) : (
            <div />
          )}

          {post.nextPost ? (
            <Link
              to={`/blog/${post.nextPost.id}`}
              className="p-8 border-2 border-slate-800 hover:bg-slate-800 hover:text-white transition-all group flex flex-col items-end gap-4 text-right"
            >
              <div className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-slate-400 group-hover:text-white/50 transition-colors">
                下一篇
                <ChevronLeft className="w-4 h-4 rotate-180" />
              </div>
              <span className="text-xl font-black tracking-tighter line-clamp-1">{post.nextPost.title}</span>
            </Link>
          ) : (
            <div />
          )}
        </div>
      </article>

      <aside className="lg:col-span-4 space-y-12">
        <div className="sticky top-32 space-y-12">
          <div className="bg-white border-l-[10px] border-slate-800 p-10 space-y-10">
            <h3 className="text-xs font-black text-slate-900 uppercase tracking-[0.2em] flex items-center gap-3 italic">
              / 目录导航
            </h3>
            <ul className="space-y-6">
              {content.toc.map((item, index) => (
                <li key={item.id}>
                  <a
                    href={`#${item.id}`}
                    className={cn(
                      'text-xs font-black uppercase tracking-widest transition-all block',
                      index === 0
                        ? 'text-slate-900 translate-x-4 border-l-4 border-slate-800 pl-4'
                        : 'text-slate-400 hover:text-slate-900 hover:pl-4',
                    )}
                  >
                    {item.text}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          <div className="bg-gradient-to-br from-slate-800 to-slate-900 p-10 text-white space-y-8 relative overflow-hidden group">
            <div className="absolute top-0 right-0 p-4 text-white/5 font-black text-7xl select-none pointer-events-none group-hover:scale-110 transition-transform duration-700">
              博客
            </div>
            <h3 className="text-xl font-black tracking-tighter border-b border-white/10 pb-4">复制文章标题</h3>
            <p className="text-slate-400 text-sm leading-relaxed font-medium">可以先把文章标题复制出去，方便你整理笔记或发给别人。</p>
            <button
              onClick={handleCopy}
              className="w-full flex items-center justify-center gap-3 py-4 bg-white text-slate-900 font-black uppercase text-xs tracking-widest hover:bg-slate-200 transition-all"
            >
              {copied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
              {copied ? '已复制' : '复制标题'}
            </button>
          </div>
        </div>
      </aside>
    </div>
  );
}
