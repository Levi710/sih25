'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Home, History, User, Settings, Info, BarChart3, Cloud } from 'lucide-react';
import { cn } from '@/lib/utils';

const navItems = [
  { name: 'Home', href: '/', icon: Home },
  { name: 'History', href: '/history', icon: History },
  { name: 'Analytics', href: '/analytics', icon: BarChart3 },
  { name: 'Profile', href: '/profile', icon: User },
];

export function Navigation() {
  const pathname = usePathname();

  if (pathname === '/welcome') return null;

  return (
    <>
      {/* Desktop Sidebar */}
      <aside className="hidden lg:flex flex-col w-64 bg-white border-r border-slate-200 h-screen sticky top-0 p-6 z-50">
        <div className="flex items-center gap-2 mb-10 px-2">
          <div className="bg-indigo-600 p-2 rounded-lg">
            <Home className="text-white w-5 h-5" />
          </div>
          <h1 className="text-xl font-bold tracking-tight text-slate-800">TravelTrack</h1>
        </div>

        <nav className="flex-1 space-y-1">
          {navItems.map((item) => {
            const isActive = pathname === item.href;
            return (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  "flex items-center gap-3 px-4 py-3 rounded-xl font-medium transition-all",
                  isActive 
                    ? "bg-indigo-50 text-indigo-700 shadow-sm shadow-indigo-100" 
                    : "text-slate-500 hover:bg-slate-50 hover:text-slate-800"
                )}
              >
                <item.icon className={cn("w-5 h-5", isActive ? "text-indigo-600" : "text-slate-400")} />
                {item.name}
              </Link>
            );
          })}
        </nav>

        <div className="pt-6 border-t border-slate-100 space-y-1">
             <Link 
              href="/info" 
              className={cn(
                "flex items-center gap-3 px-4 py-3 rounded-xl transition-all font-medium",
                pathname === '/info' ? "bg-slate-100 text-slate-900" : "text-slate-500 hover:bg-slate-50"
              )}
             >
                <Info className="w-5 h-5 text-slate-400" />
                App Info
             </Link>
             <Link 
              href="/settings" 
              className={cn(
                "flex items-center gap-3 px-4 py-3 rounded-xl transition-all font-medium",
                pathname === '/settings' ? "bg-slate-100 text-slate-900" : "text-slate-500 hover:bg-slate-50"
              )}
             >
                <Settings className="w-5 h-5 text-slate-400" />
                Settings
             </Link>
        </div>
      </aside>

      {/* Mobile Bottom Nav */}
      <nav className="lg:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-slate-200 px-6 py-3 flex justify-between items-center z-50">
        {navItems.map((item) => {
          const isActive = pathname === item.href;
          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "flex flex-col items-center gap-1",
                isActive ? "text-indigo-600" : "text-slate-400"
              )}
            >
              <item.icon className="w-6 h-6" />
              <span className="text-[10px] font-bold uppercase tracking-wider">{item.name}</span>
            </Link>
          );
        })}
      </nav>
    </>
  );
}
