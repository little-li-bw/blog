import * as React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { adminApiRequest } from '../api/client';
import { deleteAdminPost, updateAdminPostStatus } from '../api/posts';
import { clearAdminSession, getAdminSession, getAdminToken } from '../lib/auth';
import { formatDate } from '../lib/format';
import type { PostListItem } from '../types';

export default function AdminPosts() {
  const navigate = useNavigate();
  const [posts, setPosts] = React.useState<PostListItem[]>([]);
  const [loading, setLoading] = React.useState(true);
  const [error, setError] = React.useState('');
  const session = React.useMemo(() => getAdminSession(), []);

  React.useEffect(() => {
    const token = getAdminToken();
    if (!token) {
      navigate('/admin/login');
      return;
    }

    adminApiRequest<PostListItem[]>('/api/admin/posts', token)
      .then(setPosts)
      .catch((err) => {
        setError(err instanceof Error ? err.message : '加载文章失败');
      })
      .finally(() => {
        setLoading(false);
      });
  }, [navigate]);

  const handleStatusChange = async (postId: number, status: string) => {
    const token = getAdminToken();
    if (!token) {
      navigate('/admin/login');
      return;
    }

    try {
      const detail = await updateAdminPostStatus(token, postId, status);
      setPosts((current) =>
        current.map((post) =>
          post.id === postId
            ? {
                ...post,
                status: detail.status,
                publishTime: detail.publishTime,
              }
            : post,
        ),
      );
    } catch (err) {
      setError(err instanceof Error ? err.message : '更新文章状态失败');
    }
  };

  const handleDelete = async (postId: number) => {
    const token = getAdminToken();
    if (!token) {
      navigate('/admin/login');
      return;
    }

    try {
      await deleteAdminPost(token, postId);
      setPosts((current) => current.filter((post) => post.id !== postId));
    } catch (err) {
      setError(err instanceof Error ? err.message : '删除文章失败');
    }
  };

  const handleLogout = () => {
    clearAdminSession();
    navigate('/admin/login');
  };

  return (
    <div className="min-h-screen bg-slate-100">
      <div className="max-w-7xl mx-auto px-6 py-10 space-y-8">
        <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-6">
          <div className="space-y-2">
            <div className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-500">/ Admin</div>
            <h1 className="text-4xl font-black tracking-tighter text-slate-900">后台文章管理</h1>
            <p className="text-sm text-slate-500">
              当前登录：{session?.nickname || session?.username || '管理员'}
            </p>
          </div>

          <div className="flex flex-wrap gap-3">
            <Link
              to="/admin/categories"
              className="px-5 py-3 border border-slate-300 text-xs font-black uppercase tracking-widest text-slate-700"
            >
              分类管理
            </Link>
            <Link
              to="/admin/tags"
              className="px-5 py-3 border border-slate-300 text-xs font-black uppercase tracking-widest text-slate-700"
            >
              标签管理
            </Link>
            <Link
              to="/admin/site-config"
              className="px-5 py-3 border border-slate-300 text-xs font-black uppercase tracking-widest text-slate-700"
            >
              站点配置
            </Link>
            <Link
              to="/admin/posts/new"
              className="px-5 py-3 bg-slate-900 text-white text-xs font-black uppercase tracking-widest"
            >
              新建文章
            </Link>
            <Link
              to="/"
              className="px-5 py-3 border border-slate-300 text-xs font-black uppercase tracking-widest text-slate-700"
            >
              查看前台
            </Link>
            <button
              onClick={handleLogout}
              className="px-5 py-3 bg-slate-900 text-white text-xs font-black uppercase tracking-widest"
            >
              退出登录
            </button>
          </div>
        </div>

        <div className="bg-white border border-slate-200 shadow-sm overflow-hidden">
          <div className="grid grid-cols-[2fr_1fr_1fr_1fr_1fr] gap-4 px-6 py-4 border-b border-slate-200 text-[10px] font-black uppercase tracking-widest text-slate-500">
            <span>标题</span>
            <span>分类</span>
            <span>状态</span>
            <span>发布时间</span>
            <span>操作</span>
          </div>

          {loading ? <div className="px-6 py-10 text-slate-500">正在加载文章...</div> : null}
          {error ? <div className="px-6 py-10 text-red-600">{error}</div> : null}

          {!loading && !error && posts.length === 0 ? (
            <div className="px-6 py-10 text-slate-500">当前还没有文章。</div>
          ) : null}

          {!loading && !error
            ? posts.map((post) => (
                <div
                  key={post.id}
                  className="grid grid-cols-[2fr_1fr_1fr_1fr_1fr] gap-4 px-6 py-5 border-b border-slate-100 items-start"
                >
                  <div className="space-y-1">
                    <div className="font-black text-slate-900">{post.title}</div>
                    <div className="text-sm text-slate-500 line-clamp-2">{post.summary}</div>
                  </div>
                  <div className="text-sm text-slate-600">{post.categoryName}</div>
                  <div>
                    <span className="inline-flex px-2 py-1 bg-slate-100 text-[10px] font-black tracking-widest text-slate-700">
                      {post.status}
                    </span>
                  </div>
                  <div className="text-sm text-slate-600">{formatDate(post.publishTime)}</div>
                  <div className="flex gap-2">
                    <Link
                      to={`/admin/posts/${post.id}/edit`}
                      className="px-3 py-2 border border-slate-300 text-[10px] font-black tracking-widest text-slate-700"
                    >
                      编辑
                    </Link>
                    {post.status !== 'PUBLISHED' ? (
                      <button
                        onClick={() => handleStatusChange(post.id, 'PUBLISHED')}
                        className="px-3 py-2 border border-slate-300 text-[10px] font-black tracking-widest text-slate-700"
                      >
                        发布
                      </button>
                    ) : null}
                    {post.status === 'PUBLISHED' ? (
                      <button
                        onClick={() => handleStatusChange(post.id, 'OFFLINE')}
                        className="px-3 py-2 border border-slate-300 text-[10px] font-black tracking-widest text-slate-700"
                      >
                        下线
                      </button>
                    ) : null}
                    <button
                      onClick={() => handleDelete(post.id)}
                      className="px-3 py-2 border border-red-200 text-[10px] font-black tracking-widest text-red-600"
                    >
                      删除
                    </button>
                  </div>
                </div>
              ))
            : null}
        </div>
      </div>
    </div>
  );
}
