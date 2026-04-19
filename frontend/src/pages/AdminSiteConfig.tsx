import * as React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { getAdminSiteConfig, updateAdminSiteConfig } from '../api/site';
import { getAdminToken } from '../lib/auth';
import type { SiteConfig } from '../types';

const EMPTY_SITE_CONFIG: SiteConfig = {
  siteName: '',
  heroTitle: '',
  heroSubtitle: '',
  aboutMe: '',
  skillsBackend: '',
  skillsFrontend: '',
  skillsDatabase: '',
  skillsTools: '',
  email: '',
  githubUrl: '',
  resumeUrl: '',
};

export default function AdminSiteConfig() {
  const navigate = useNavigate();
  const [form, setForm] = React.useState<SiteConfig>(EMPTY_SITE_CONFIG);
  const [loading, setLoading] = React.useState(true);
  const [saving, setSaving] = React.useState(false);
  const [error, setError] = React.useState('');
  const [successMessage, setSuccessMessage] = React.useState('');

  React.useEffect(() => {
    const token = getAdminToken();
    if (!token) {
      navigate('/admin/login');
      return;
    }

    getAdminSiteConfig(token)
      .then((config) => {
        setForm(config);
      })
      .catch((err) => {
        setError(err instanceof Error ? err.message : '加载站点配置失败');
      })
      .finally(() => {
        setLoading(false);
      });
  }, [navigate]);

  const handleChange = (field: keyof SiteConfig, value: string) => {
    setForm((current) => ({
      ...current,
      [field]: value,
    }));
    setSuccessMessage('');
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
    setSuccessMessage('');

    try {
      const saved = await updateAdminSiteConfig(token, form);
      setForm(saved);
      setSuccessMessage('配置已保存');
    } catch (err) {
      setError(err instanceof Error ? err.message : '保存站点配置失败');
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
            <h1 className="text-4xl font-black tracking-tighter text-slate-900">站点配置</h1>
          </div>
          <Link
            to="/admin/posts"
            className="px-5 py-3 border border-slate-300 text-xs font-black uppercase tracking-widest text-slate-700"
          >
            返回列表
          </Link>
        </div>

        <form className="bg-white border border-slate-200 shadow-sm p-8 space-y-6" onSubmit={handleSubmit}>
          {loading ? <div className="text-slate-500">正在加载站点配置...</div> : null}

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <label htmlFor="siteName" className="block text-xs font-black uppercase tracking-widest text-slate-700">
                站点名称
              </label>
              <input
                id="siteName"
                value={form.siteName}
                onChange={(event) => handleChange('siteName', event.target.value)}
                className="w-full h-12 px-4 border border-slate-200 bg-slate-50 outline-none focus:border-slate-900"
              />
            </div>

            <div className="space-y-2">
              <label htmlFor="email" className="block text-xs font-black uppercase tracking-widest text-slate-700">
                邮箱
              </label>
              <input
                id="email"
                value={form.email}
                onChange={(event) => handleChange('email', event.target.value)}
                className="w-full h-12 px-4 border border-slate-200 bg-slate-50 outline-none focus:border-slate-900"
              />
            </div>
          </div>

          <div className="space-y-2">
            <label htmlFor="heroTitle" className="block text-xs font-black uppercase tracking-widest text-slate-700">
              首页主标题
            </label>
            <input
              id="heroTitle"
              value={form.heroTitle}
              onChange={(event) => handleChange('heroTitle', event.target.value)}
              className="w-full h-12 px-4 border border-slate-200 bg-slate-50 outline-none focus:border-slate-900"
            />
          </div>

          <div className="space-y-2">
            <label htmlFor="heroSubtitle" className="block text-xs font-black uppercase tracking-widest text-slate-700">
              首页副标题
            </label>
            <input
              id="heroSubtitle"
              value={form.heroSubtitle}
              onChange={(event) => handleChange('heroSubtitle', event.target.value)}
              className="w-full h-12 px-4 border border-slate-200 bg-slate-50 outline-none focus:border-slate-900"
            />
          </div>

          <div className="space-y-2">
            <label htmlFor="aboutMe" className="block text-xs font-black uppercase tracking-widest text-slate-700">
              关于我
            </label>
            <textarea
              id="aboutMe"
              value={form.aboutMe}
              onChange={(event) => handleChange('aboutMe', event.target.value)}
              rows={4}
              className="w-full px-4 py-3 border border-slate-200 bg-slate-50 outline-none focus:border-slate-900"
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <label htmlFor="skillsBackend" className="block text-xs font-black uppercase tracking-widest text-slate-700">
                后端技能
              </label>
              <textarea
                id="skillsBackend"
                value={form.skillsBackend}
                onChange={(event) => handleChange('skillsBackend', event.target.value)}
                rows={3}
                className="w-full px-4 py-3 border border-slate-200 bg-slate-50 outline-none focus:border-slate-900"
              />
            </div>

            <div className="space-y-2">
              <label htmlFor="skillsFrontend" className="block text-xs font-black uppercase tracking-widest text-slate-700">
                前端技能
              </label>
              <textarea
                id="skillsFrontend"
                value={form.skillsFrontend}
                onChange={(event) => handleChange('skillsFrontend', event.target.value)}
                rows={3}
                className="w-full px-4 py-3 border border-slate-200 bg-slate-50 outline-none focus:border-slate-900"
              />
            </div>

            <div className="space-y-2">
              <label htmlFor="skillsDatabase" className="block text-xs font-black uppercase tracking-widest text-slate-700">
                数据库技能
              </label>
              <textarea
                id="skillsDatabase"
                value={form.skillsDatabase}
                onChange={(event) => handleChange('skillsDatabase', event.target.value)}
                rows={3}
                className="w-full px-4 py-3 border border-slate-200 bg-slate-50 outline-none focus:border-slate-900"
              />
            </div>

            <div className="space-y-2">
              <label htmlFor="skillsTools" className="block text-xs font-black uppercase tracking-widest text-slate-700">
                工具与部署
              </label>
              <textarea
                id="skillsTools"
                value={form.skillsTools}
                onChange={(event) => handleChange('skillsTools', event.target.value)}
                rows={3}
                className="w-full px-4 py-3 border border-slate-200 bg-slate-50 outline-none focus:border-slate-900"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <label htmlFor="githubUrl" className="block text-xs font-black uppercase tracking-widest text-slate-700">
                GitHub 链接
              </label>
              <input
                id="githubUrl"
                value={form.githubUrl}
                onChange={(event) => handleChange('githubUrl', event.target.value)}
                className="w-full h-12 px-4 border border-slate-200 bg-slate-50 outline-none focus:border-slate-900"
              />
            </div>

            <div className="space-y-2">
              <label htmlFor="resumeUrl" className="block text-xs font-black uppercase tracking-widest text-slate-700">
                简历链接
              </label>
              <input
                id="resumeUrl"
                value={form.resumeUrl}
                onChange={(event) => handleChange('resumeUrl', event.target.value)}
                className="w-full h-12 px-4 border border-slate-200 bg-slate-50 outline-none focus:border-slate-900"
              />
            </div>
          </div>

          {error ? <div className="text-sm text-red-600">{error}</div> : null}
          {successMessage ? <div className="text-sm text-emerald-600">{successMessage}</div> : null}

          <div className="flex justify-end">
            <button
              type="submit"
              disabled={saving || loading}
              className="px-6 py-3 bg-slate-900 text-white text-xs font-black uppercase tracking-widest disabled:opacity-60"
            >
              {saving ? '保存中...' : '保存配置'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
