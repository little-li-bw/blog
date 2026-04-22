import * as React from 'react';
import { useNavigate } from 'react-router-dom';
import { Eye, EyeOff } from 'lucide-react';
import { login } from '../api/auth';
import { saveAdminSession } from '../lib/auth';

export default function AdminLogin() {
  const navigate = useNavigate();
  const [username, setUsername] = React.useState('');
  const [password, setPassword] = React.useState('');
  const [showPassword, setShowPassword] = React.useState(false);
  const [loading, setLoading] = React.useState(false);
  const [error, setError] = React.useState('');

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setLoading(true);
    setError('');

    try {
      const response = await login({ username, password });
      saveAdminSession(response);
      navigate('/admin/posts');
    } catch (err) {
      setError(err instanceof Error ? err.message : '登录失败');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-slate-100 px-6 py-16">
      <div className="w-full max-w-md space-y-8 border border-slate-200 bg-white p-10 shadow-xl shadow-slate-200/60">
        <div className="space-y-3">
          <div className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-500">/ Admin</div>
          <h1 className="text-4xl font-black tracking-tighter text-slate-900">后台登录</h1>
          <p className="text-sm text-slate-500">使用管理员账号进入文章管理后台。</p>
        </div>

        <form className="space-y-6" autoComplete="on" onSubmit={handleSubmit}>
          <div className="space-y-2">
            <label htmlFor="username" className="block text-xs font-black uppercase tracking-widest text-slate-700">
              用户名
            </label>
            <input
              id="username"
              name="username"
              autoComplete="username"
              value={username}
              onChange={(event) => setUsername(event.target.value)}
              className="h-12 w-full border border-slate-200 bg-slate-50 px-4 outline-none focus:border-slate-900"
            />
          </div>

          <div className="space-y-2">
            <label htmlFor="password" className="block text-xs font-black uppercase tracking-widest text-slate-700">
              密码
            </label>
            <div className="relative">
              <input
                id="password"
                name="password"
                type={showPassword ? 'text' : 'password'}
                autoComplete="current-password"
                value={password}
                onChange={(event) => setPassword(event.target.value)}
                className="h-12 w-full border border-slate-200 bg-slate-50 px-4 pr-12 outline-none focus:border-slate-900"
              />
              <button
                type="button"
                aria-label={showPassword ? '隐藏密码' : '显示密码'}
                onClick={() => setShowPassword((current) => !current)}
                className="absolute inset-y-0 right-0 flex w-12 items-center justify-center text-slate-400 transition-colors hover:text-slate-900"
              >
                {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
              </button>
            </div>
          </div>

          {error ? <p className="text-sm font-medium text-red-600">{error}</p> : null}

          <button
            type="submit"
            disabled={loading}
            className="h-12 w-full bg-slate-900 text-white font-black uppercase tracking-widest disabled:opacity-60"
          >
            {loading ? '登录中...' : '登录后台'}
          </button>
        </form>
      </div>
    </div>
  );
}
