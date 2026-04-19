import * as React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { getAdminToken } from '../../lib/auth';

export interface TaxonomyItem {
  id: number;
  name: string;
  sort?: number;
}

interface AdminTaxonomyPageProps<T extends TaxonomyItem> {
  title: string;
  singularLabel: string;
  nameLabel: string;
  loadItems: (token: string) => Promise<T[]>;
  createItem: (token: string, payload: { name: string; sort?: number }) => Promise<T>;
  deleteItem: (token: string, id: number) => Promise<void>;
  showSort?: boolean;
}

export default function AdminTaxonomyPage<T extends TaxonomyItem>({
  title,
  singularLabel,
  nameLabel,
  loadItems,
  createItem,
  deleteItem,
  showSort = false,
}: AdminTaxonomyPageProps<T>) {
  const navigate = useNavigate();
  const [items, setItems] = React.useState<T[]>([]);
  const [name, setName] = React.useState('');
  const [sort, setSort] = React.useState('0');
  const [loading, setLoading] = React.useState(true);
  const [submitting, setSubmitting] = React.useState(false);
  const [error, setError] = React.useState('');

  React.useEffect(() => {
    const token = getAdminToken();
    if (!token) {
      navigate('/admin/login');
      return;
    }

    loadItems(token)
      .then(setItems)
      .catch((err) => {
        setError(err instanceof Error ? err.message : `加载${title}失败`);
      })
      .finally(() => {
        setLoading(false);
      });
  }, [loadItems, navigate, title]);

  const handleCreate = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const token = getAdminToken();
    if (!token) {
      navigate('/admin/login');
      return;
    }

    setSubmitting(true);
    setError('');

    try {
      const created = await createItem(token, {
        name,
        sort: showSort ? Number(sort) : undefined,
      });
      setItems((current) => [...current, created]);
      setName('');
      setSort('0');
    } catch (err) {
      setError(err instanceof Error ? err.message : `新增${singularLabel}失败`);
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (id: number) => {
    const token = getAdminToken();
    if (!token) {
      navigate('/admin/login');
      return;
    }

    try {
      await deleteItem(token, id);
      setItems((current) => current.filter((item) => item.id !== id));
    } catch (err) {
      setError(err instanceof Error ? err.message : `删除${singularLabel}失败`);
    }
  };

  return (
    <div className="min-h-screen bg-slate-100">
      <div className="max-w-5xl mx-auto px-6 py-10 space-y-8">
        <div className="flex items-end justify-between gap-6">
          <div className="space-y-2">
            <div className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-500">/ Admin</div>
            <h1 className="text-4xl font-black tracking-tighter text-slate-900">{title}</h1>
          </div>
          <Link
            to="/admin/posts"
            className="px-5 py-3 border border-slate-300 text-xs font-black uppercase tracking-widest text-slate-700"
          >
            返回文章列表
          </Link>
        </div>

        <form className="bg-white border border-slate-200 shadow-sm p-8 space-y-6" onSubmit={handleCreate}>
          <div className={`grid gap-6 ${showSort ? 'grid-cols-1 md:grid-cols-2' : 'grid-cols-1'}`}>
            <div className="space-y-2">
              <label htmlFor="name" className="block text-xs font-black uppercase tracking-widest text-slate-700">
                {nameLabel}
              </label>
              <input
                id="name"
                value={name}
                onChange={(event) => setName(event.target.value)}
                className="w-full h-12 px-4 border border-slate-200 bg-slate-50 outline-none focus:border-slate-900"
              />
            </div>

            {showSort ? (
              <div className="space-y-2">
                <label htmlFor="sort" className="block text-xs font-black uppercase tracking-widest text-slate-700">
                  排序
                </label>
                <input
                  id="sort"
                  value={sort}
                  onChange={(event) => setSort(event.target.value)}
                  className="w-full h-12 px-4 border border-slate-200 bg-slate-50 outline-none focus:border-slate-900"
                />
              </div>
            ) : null}
          </div>

          {error ? <div className="text-sm text-red-600">{error}</div> : null}

          <div className="flex justify-end">
            <button
              type="submit"
              disabled={submitting}
              className="px-6 py-3 bg-slate-900 text-white text-xs font-black uppercase tracking-widest disabled:opacity-60"
            >
              {submitting ? '提交中...' : `新增${singularLabel}`}
            </button>
          </div>
        </form>

        <div className="bg-white border border-slate-200 shadow-sm overflow-hidden">
          <div className={`grid gap-4 px-6 py-4 border-b border-slate-200 text-[10px] font-black uppercase tracking-widest text-slate-500 ${showSort ? 'grid-cols-[2fr_1fr_1fr]' : 'grid-cols-[2fr_1fr]'}`}>
            <span>{nameLabel}</span>
            {showSort ? <span>排序</span> : null}
            <span>操作</span>
          </div>

          {loading ? <div className="px-6 py-10 text-slate-500">正在加载{title}...</div> : null}
          {!loading && items.length === 0 ? (
            <div className="px-6 py-10 text-slate-500">当前还没有{singularLabel}。</div>
          ) : null}

          {!loading
            ? items.map((item) => (
                <div
                  key={item.id}
                  className={`grid gap-4 px-6 py-5 border-b border-slate-100 items-center ${showSort ? 'grid-cols-[2fr_1fr_1fr]' : 'grid-cols-[2fr_1fr]'}`}
                >
                  <div className="font-black text-slate-900">{item.name}</div>
                  {showSort ? <div className="text-sm text-slate-600">{item.sort ?? 0}</div> : null}
                  <div>
                    <button
                      onClick={() => handleDelete(item.id)}
                      className="px-3 py-2 border border-slate-300 text-[10px] font-black tracking-widest text-slate-700"
                      aria-label={`删除 ${item.name}`}
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
