import * as React from 'react';
import { NavLink, Link } from 'react-router-dom';
import { Mail, ExternalLink, Menu, X } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { cn } from '../lib/utils';

const navLinks: Array<{ name: string; href: string; external?: boolean; download?: boolean }> = [
  { name: '首页', href: '/' },
  { name: '技术博客', href: '/blog' },
  { name: '简历下载', href: '#', download: true },
  { name: '联系方式', href: '#contact' },
];

export default function Layout({ children }: { children: React.ReactNode }) {
  const [isScrolled, setIsScrolled] = React.useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = React.useState(false);

  React.useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <div className="min-h-screen bg-white text-slate-900 font-sans selection:bg-slate-200 selection:text-slate-900">
      {/* Navigation */}
      <nav
        className={cn(
          'fixed top-0 left-0 right-0 z-50 transition-all duration-300 border-b',
          isScrolled
            ? 'bg-white/90 backdrop-blur-md border-slate-200 py-3 shadow-sm'
            : 'bg-transparent border-transparent py-5'
        )}
      >
        <div className="max-w-7xl mx-auto px-6 flex items-center justify-between">
          <Link to="/" className="text-xl font-black tracking-tighter text-slate-900 uppercase">
            Portfolio<span className="text-slate-400">/</span>
          </Link>

          {/* Desktop Nav */}
          <div className="hidden md:flex items-center space-x-8">
            {navLinks.map((link) => (
              link.external ? (
                <a
                  key={link.name}
                  href={link.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-xs font-bold uppercase tracking-widest text-slate-500 hover:text-slate-900 transition-colors flex items-center gap-1"
                >
                  {link.name}
                  <ExternalLink className="w-3 h-3" />
                </a>
              ) : (
                <NavLink
                  key={link.name}
                  to={link.href}
                  className={({ isActive }) =>
                    cn(
                      'text-xs font-bold uppercase tracking-widest transition-colors hover:text-slate-900',
                      isActive ? 'text-slate-900' : 'text-slate-500'
                    )
                  }
                >
                  {link.name}
                </NavLink>
              )
            ))}
          </div>

          {/* Mobile Toggle */}
          <button
            className="md:hidden p-2 text-slate-600"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          >
            {isMobileMenuOpen ? <X /> : <Menu />}
          </button>
        </div>

        {/* Mobile Menu */}
        <AnimatePresence>
          {isMobileMenuOpen && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="md:hidden bg-white border-b border-slate-200 overflow-hidden"
            >
              <div className="px-6 py-8 flex flex-col space-y-6">
                {navLinks.map((link) => (
                  <a
                    key={link.name}
                    href={link.href}
                    className="text-sm font-bold uppercase tracking-widest text-slate-700 hover:text-slate-900"
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    {link.name}
                  </a>
                ))}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </nav>

      {/* Main Content */}
      <main className="pt-24 pb-20">
        {children}
      </main>

      {/* Footer */}
      <footer id="contact" className="bg-gradient-to-b from-slate-900 to-slate-950 text-slate-400 py-24">
        <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 md:grid-cols-2 gap-16 items-start">
          <div className="space-y-8">
            <h3 className="text-xl font-black text-white uppercase tracking-tighter">联系方式</h3>
            <div className="space-y-4">
              <p className="flex items-center gap-4 group">
                <span className="p-3 bg-white/5 rounded-full text-white group-hover:bg-white group-hover:text-slate-900 transition-all">
                  <Mail className="w-5 h-5" />
                </span>
                <span className="font-medium">libowen826@email.com</span>
              </p>
            </div>
          </div>
          <div className="md:text-right md:pt-1">
            <p className="text-slate-500 text-sm font-bold uppercase tracking-widest">
              © 2026 你的名字. 保留所有权利。
            </p>
            <p className="text-slate-600 text-xs mt-4">
              本站基于 React, Tailwind & Motion 构建。
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
