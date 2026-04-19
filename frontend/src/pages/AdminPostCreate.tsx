import * as React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { createAdminPost } from '../api/posts';
import { getCategories, getTags } from '../api/site';
import { getAdminToken } from '../lib/auth';
import type { Category, TagOption } from '../types';

export default function AdminPostCreate() {
  const navigate = useNavigate();
  const [categories, setCategories] = React.useState<Category[]>([]);
  const [tags, setTags] = React.useState<TagOption[]>([]);
  const [title, setTitle] = React.useState('');
  const [summary, setSummary] = React.useState('');
  const [contentMd, setContentMd] = React.useState('');
  const [categoryId, setCategoryId] = React.useState('');
  const [selectedTagIds, setSelectedTagIds] = React.useState<number[]>([]);
  const [loading, setLoading] = React.useState(true);
  const [saving, setSaving] = React.useState(false);
  const [error, setError] = React.useState('');

  React.useEffect(() => {
    const token = getAdminToken();
    if (!token) {
      navigate('/admin/login');
      return;
    }

    Promise.all([getCategories(), getTags()])
      .then(([categoryList, tagList]) => {
        setCategories(categoryList);
        setTags(tagList);
        if (categoryList[0]) {
          setCategoryId(String(categoryList[0].id));
        }
      })
      .catch((err) => {
        setError(err instanceof Error ? err.message : '加载发文配置失败');
      })
      .finally(() => {
        setLoading(false);
      });
  }, [navigate]);

  const toggleTag = (tagId: number) => {
    setSelectedTagIds((current) =>
      current.includes(tagId) ? current.filter((item) => item !== tagId) : [...current, tagId],
    );
  };

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const token = getAdminToken();
    if (!token) {
      navigate('/admin/login');
      return;
    }

    setSaving(true);
    setError('');

    try {
      await createAdminPost(token, {
        title,
        summary,
        contentMd,
        categoryId: Number(categoryId),
        tagIds: selectedTagIds,
      });
      navigate('/admin/posts');
    } catch (err) {
      setError(err instanceof Error ? err.message : '保存文章失败');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-100">
      <div className="max-w-5xl mx-auto px-6 py-10 space-y-8">
        <div className="flex items-end justify-between gap-6">
          <div className="space-y-2">
            <div className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-500">/ Admin</div>
            <h1 className="text-4xl font-black tracking-tighter text-slate-900">新建文章</h1>
          </div>
          <Link
            to="/admin/posts"
            className="px-5 py-3 border border-slate-300 text-xs font-black uppercase tracking-widest text-slate-700"
          >
            返回列表
          </Link>
        </div>

        <form className="bg-white border border-slate-200 shadow-sm p-8 space-y-6" onSubmit={handleSubmit}>
          {loading ? <div className="text-slate-500">正在加载分类和标签...</div> : null}

          <div className="space-y-2">
            <label htmlFor="title" className="block text-xs font-black uppercase tracking-widest text-slate-700">
              文章标题
            </label>
            <input
              id="title"
              value={title}
              onChange={(event) => setTitle(event.target.value)}
              className="w-full h-12 px-4 border border-slate-200 bg-slate-50 outline-none focus:border-slate-900"
            />
          </div>

          <div className="space-y-2">
            <label htmlFor="summary" className="block text-xs font-black uppercase tracking-widest text-slate-700">
              文章摘要
            </label>
            <textarea
              id="summary"
              value={summary}
              onChange={(event) => setSummary(event.target.value)}
              rows={3}
              className="w-full px-4 py-3 border border-slate-200 bg-slate-50 outline-none focus:border-slate-900"
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <label htmlFor="category" className="block text-xs font-black uppercase tracking-widest text-slate-700">
                分类
              </label>
              <select
                id="category"
                value={categoryId}
                onChange={(event) => setCategoryId(event.target.value)}
                className="w-full h-12 px-4 border border-slate-200 bg-slate-50 outline-none focus:border-slate-900"
              >
                {categories.map((category) => (
                  <option key={category.id} value={category.id}>
                    {category.name}
                  </option>
                ))}
              </select>
            </div>

            <div className="space-y-2">
              <span className="block text-xs font-black uppercase tracking-widest text-slate-700">标签</span>
              <div className="flex flex-wrap gap-3">
                {tags.map((tag) => (
                  <label key={tag.id} className="inline-flex items-center gap-2 text-sm text-slate-700">
                    <input
                      type="checkbox"
                      aria-label={tag.name}
                      checked={selectedTagIds.includes(tag.id)}
                      onChange={() => toggleTag(tag.id)}
                    />
                    {tag.name}
                  </label>
                ))}
              </div>
            </div>
          </div>

          <div className="space-y-2">
            <label htmlFor="contentMd" className="block text-xs font-black uppercase tracking-widest text-slate-700">
              Markdown 正文
            </label>
            <textarea
              id="contentMd"
              value={contentMd}
              onChange={(event) => setContentMd(event.target.value)}
              rows={14}
              className="w-full px-4 py-3 border border-slate-200 bg-slate-50 outline-none focus:border-slate-900 font-mono text-sm"
            />
          </div>

          {error ? <div className="text-sm text-red-600">{error}</div> : null}

          <div className="flex justify-end">
            <button
              type="submit"
              disabled={saving}
              className="px-6 py-3 bg-slate-900 text-white text-xs font-black uppercase tracking-widest disabled:opacity-60"
            >
              {saving ? '保存中...' : '保存草稿'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
