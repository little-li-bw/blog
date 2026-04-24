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

const JAVA_KEYWORDS = new Set([
  'abstract',
  'assert',
  'boolean',
  'break',
  'byte',
  'case',
  'catch',
  'char',
  'class',
  'const',
  'continue',
  'default',
  'do',
  'double',
  'else',
  'enum',
  'extends',
  'final',
  'finally',
  'float',
  'for',
  'goto',
  'if',
  'implements',
  'import',
  'instanceof',
  'int',
  'interface',
  'long',
  'native',
  'new',
  'package',
  'private',
  'protected',
  'public',
  'return',
  'short',
  'static',
  'strictfp',
  'super',
  'switch',
  'synchronized',
  'this',
  'throw',
  'throws',
  'transient',
  'try',
  'void',
  'volatile',
  'while',
]);

function escapeHtml(value: string): string {
  return value
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;')
    .replaceAll("'", '&#39;');
}

function wrapToken(type: 'annotation' | 'comment' | 'keyword' | 'string' | 'type', value: string): string {
  return `<span data-token="${type}">${escapeHtml(value)}</span>`;
}

function isIdentifierStart(char: string): boolean {
  return /[A-Za-z_$]/.test(char);
}

function isIdentifierPart(char: string): boolean {
  return /[A-Za-z0-9_$]/.test(char);
}

function consumeQuotedLiteral(source: string, start: number, quote: '"' | "'"): number {
  let index = start + 1;
  while (index < source.length) {
    const current = source[index];
    if (current === '\\') {
      index += 2;
      continue;
    }
    index += 1;
    if (current === quote) {
      break;
    }
  }
  return index;
}

function highlightJavaCode(source: string): string {
  let html = '';
  let index = 0;

  while (index < source.length) {
    const current = source[index];
    const next = source[index + 1];

    if (current === '/' && next === '/') {
      let end = index + 2;
      while (end < source.length && source[end] !== '\n') {
        end += 1;
      }
      html += wrapToken('comment', source.slice(index, end));
      index = end;
      continue;
    }

    if (current === '/' && next === '*') {
      let end = index + 2;
      while (end < source.length && !(source[end] === '*' && source[end + 1] === '/')) {
        end += 1;
      }
      end = Math.min(end + 2, source.length);
      html += wrapToken('comment', source.slice(index, end));
      index = end;
      continue;
    }

    if (current === '"' || current === "'") {
      const end = consumeQuotedLiteral(source, index, current);
      html += wrapToken('string', source.slice(index, end));
      index = end;
      continue;
    }

    if (current === '@' && isIdentifierStart(next ?? '')) {
      let end = index + 1;
      while (end < source.length && (isIdentifierPart(source[end]) || source[end] === '.')) {
        end += 1;
      }
      html += wrapToken('annotation', source.slice(index, end));
      index = end;
      continue;
    }

    if (isIdentifierStart(current)) {
      let end = index + 1;
      while (end < source.length && isIdentifierPart(source[end])) {
        end += 1;
      }
      const token = source.slice(index, end);
      if (JAVA_KEYWORDS.has(token)) {
        html += wrapToken('keyword', token);
      } else if (/^[A-Z]/.test(token)) {
        html += wrapToken('type', token);
      } else {
        html += escapeHtml(token);
      }
      index = end;
      continue;
    }

    html += escapeHtml(current);
    index += 1;
  }

  return html;
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

  const codeBlocks = Array.from(document.querySelectorAll('pre'));
  codeBlocks.forEach((pre) => {
    pre.setAttribute('data-code-block', 'true');
    const blockCode = pre.querySelector('code');
    if (blockCode) {
      blockCode.setAttribute('data-inline-code', 'false');
      if (blockCode.className.split(/\s+/).includes('language-java')) {
        blockCode.innerHTML = highlightJavaCode(blockCode.textContent ?? '');
      }
    }
  });

  const inlineCodes = Array.from(document.querySelectorAll('code'));
  inlineCodes.forEach((code) => {
    if (!code.closest('pre')) {
      code.setAttribute('data-inline-code', 'true');
    }
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
    return <div className="mx-auto max-w-7xl px-6 py-32 text-center text-slate-500">正在加载文章...</div>;
  }

  if (error || !post) {
    return (
      <div className="mx-auto max-w-7xl space-y-8 px-6 py-32 text-center">
        <h2 className="text-4xl font-black uppercase tracking-tighter text-slate-900 italic">404 - 文章不存在</h2>
        <Link
          to="/"
          className="inline-block bg-gradient-to-r from-slate-800 to-slate-900 px-8 py-3 text-xs font-black uppercase tracking-widest text-white"
        >
          返回首页
        </Link>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-[1760px] px-6 py-12 xl:px-8 2xl:px-10">
      <div className="relative">
        <article className="mx-auto max-w-5xl min-w-0 space-y-16" role="article">
          <div className="space-y-10 border-b-2 border-slate-100 pb-12">
            <button
              onClick={() => navigate(-1)}
              className="group inline-flex items-center gap-2 text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 transition-colors hover:text-slate-900"
            >
              <ChevronLeft className="h-4 w-4 transition-transform group-hover:-translate-x-1" />
              返回列表
            </button>

            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-5xl font-black leading-[0.9] tracking-tighter text-slate-900 md:text-7xl"
            >
              {post.title}
            </motion.h1>

            <div className="flex flex-wrap items-center gap-8 text-[10px] font-black uppercase tracking-widest text-slate-400">
              <span className="flex items-center gap-2 border border-slate-200 bg-slate-50 px-3 py-1 text-slate-900">
                <Calendar className="h-4 w-4" />
                {formatDate(post.publishTime)}
              </span>
              <span className="flex items-center gap-2">
                <Tag className="h-4 w-4" />
                {post.categoryName}
              </span>
              <span className="flex items-center gap-2">
                <Eye className="h-4 w-4" />
                {viewCount} 次阅读
              </span>
            </div>

            <div className="flex flex-wrap gap-2">
              {post.tags.map((tag) => (
                <span key={tag} className="rounded-md bg-slate-100 px-2 py-1 text-[10px] font-bold text-slate-600">
                  {tag}
                </span>
              ))}
            </div>
          </div>

          <div
            className="blog-markdown prose prose-slate prose-lg max-w-none prose-headings:font-black prose-headings:text-slate-900 prose-p:leading-[1.8] prose-p:text-slate-600 prose-code:rounded-none prose-code:bg-slate-100 prose-code:px-2 prose-code:py-0.5 prose-code:text-slate-900"
            dangerouslySetInnerHTML={{ __html: content.html }}
          />

          <div className="grid grid-cols-1 gap-8 border-t-2 border-slate-100 pt-20 md:grid-cols-2">
            {post.previousPost ? (
              <Link
                to={`/blog/${post.previousPost.id}`}
                className="group flex flex-col items-start gap-4 border-2 border-slate-800 p-8 transition-all hover:bg-slate-800 hover:text-white"
              >
                <div className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-slate-400 transition-colors group-hover:text-white/50">
                  <ChevronLeft className="h-4 w-4" />
                  上一篇
                </div>
                <span className="line-clamp-1 text-xl font-black tracking-tighter">{post.previousPost.title}</span>
              </Link>
            ) : (
              <div />
            )}

            {post.nextPost ? (
              <Link
                to={`/blog/${post.nextPost.id}`}
                className="group flex flex-col items-end gap-4 border-2 border-slate-800 p-8 text-right transition-all hover:bg-slate-800 hover:text-white"
              >
                <div className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-slate-400 transition-colors group-hover:text-white/50">
                  下一篇
                  <ChevronLeft className="h-4 w-4 rotate-180" />
                </div>
                <span className="line-clamp-1 text-xl font-black tracking-tighter">{post.nextPost.title}</span>
              </Link>
            ) : (
              <div />
            )}
          </div>
        </article>

        <aside className="mt-16 space-y-12 lg:mt-0 lg:absolute lg:right-0 lg:top-0 lg:w-72 xl:w-80">
          <div className="space-y-12 lg:sticky lg:top-32">
            <div className="space-y-8 border-l-[10px] border-slate-800 bg-white p-7 xl:p-8">
              <h3 className="flex items-center gap-3 text-xs font-black uppercase tracking-[0.2em] text-slate-900 italic">
                / 目录导航
              </h3>
              <ul className="space-y-6">
                {content.toc.map((item, index) => (
                  <li key={item.id}>
                    <a
                      href={`#${item.id}`}
                      className={cn(
                        'block text-xs font-black uppercase tracking-widest transition-all',
                        index === 0
                          ? 'translate-x-4 border-l-4 border-slate-800 pl-4 text-slate-900'
                          : 'text-slate-400 hover:pl-4 hover:text-slate-900',
                      )}
                    >
                      {item.text}
                    </a>
                  </li>
                ))}
              </ul>
            </div>

            <div className="group relative overflow-hidden space-y-8 bg-gradient-to-br from-slate-800 to-slate-900 p-10 text-white">
              <div className="pointer-events-none absolute right-0 top-0 select-none p-4 text-7xl font-black text-white/5 transition-transform duration-700 group-hover:scale-110">
                博客
              </div>
              <h3 className="border-b border-white/10 pb-4 text-xl font-black tracking-tighter">复制文章标题</h3>
              <p className="text-sm font-medium leading-relaxed text-slate-400">
                可以先把文章标题复制出去，方便你整理笔记或发给别人。
              </p>
              <button
                onClick={handleCopy}
                className="flex w-full items-center justify-center gap-3 bg-white py-4 text-xs font-black uppercase tracking-widest text-slate-900 transition-all hover:bg-slate-200"
              >
                {copied ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
                {copied ? '已复制' : '复制标题'}
              </button>
            </div>
          </div>
        </aside>
      </div>
    </div>
  );
}
