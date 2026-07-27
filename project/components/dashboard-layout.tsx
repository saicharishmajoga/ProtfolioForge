'use client';

import * as React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import {
  LayoutDashboard, FolderOpen,
  Sparkles, Rocket, Moon, Sun, Search,
  Bell, Menu, X, LogOut, ChevronRight, User, Settings,
} from 'lucide-react';
import { useTheme } from 'next-themes';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import {
  DropdownMenu, DropdownMenuTrigger, DropdownMenuContent,
  DropdownMenuItem, DropdownMenuSeparator, DropdownMenuLabel,
} from '@/components/ui/dropdown-menu';
import { Input } from '@/components/ui/input';

import { getUser, clearSession } from '@/lib/session-manager';

const navItems = [
  { href: '/dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { href: '/dashboard/portfolios', label: 'My Portfolios', icon: FolderOpen },
];

export function DashboardLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const { theme, setTheme } = useTheme();
  const [userName, setUserName] = React.useState('User');
  const [userEmail, setUserEmail] = React.useState('user@example.com');
  const [userPhoto, setUserPhoto] = React.useState('');
  const [mounted, setMounted] = React.useState(false);
  const [sidebarOpen, setSidebarOpen] = React.useState(false);
  React.useEffect(() => {
    setMounted(true);
    if (typeof window !== 'undefined') {
      const user = getUser();
      if (user) {
        if (user.name) setUserName(user.name);
        if (user.email) setUserEmail(user.email);
        if (user.photo) setUserPhoto(user.photo);
      }
    }
  }, []);

  const current = navItems.find((n) => n.href === pathname || (n.href !== '/dashboard' && pathname.startsWith(n.href)));

  const handleSignOut = () => {
    if (typeof window !== 'undefined') {
      clearSession();
    }
  };

  return (
    <div className="flex min-h-screen bg-background">
      {/* Sidebar - Desktop */}
      <aside className="fixed inset-y-0 left-0 z-40 hidden w-64 flex-col border-r bg-card lg:flex">
        <SidebarContent pathname={pathname} />
      </aside>

      {/* Sidebar - Mobile */}
      <AnimatePresence>
        {sidebarOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 z-40 bg-black/50 lg:hidden"
              onClick={() => setSidebarOpen(false)}
            />
            <motion.aside
              initial={{ x: -280 }}
              animate={{ x: 0 }}
              exit={{ x: -280 }}
              transition={{ type: 'spring', stiffness: 300, damping: 30 }}
              className="fixed inset-y-0 left-0 z-50 flex w-64 flex-col border-r bg-card lg:hidden"
            >
              <SidebarContent pathname={pathname} onNavigate={() => setSidebarOpen(false)} />
            </motion.aside>
          </>
        )}
      </AnimatePresence>

      {/* Main */}
      <div className="flex flex-1 flex-col lg:pl-64">
        {/* Topbar */}
        <header className="sticky top-0 z-30 flex h-16 items-center gap-4 border-b bg-background/80 px-4 backdrop-blur-lg sm:px-6">
          <Button variant="ghost" size="icon" className="lg:hidden" onClick={() => setSidebarOpen(true)}>
            <Menu className="h-5 w-5" />
          </Button>
          <div className="flex items-center gap-1.5 text-sm text-muted-foreground">
            <span className="hidden sm:inline">PortfolioForge</span>
            <ChevronRight className="hidden h-3.5 w-3.5 sm:inline" />
            <span className="font-medium text-foreground">{current?.label ?? 'Dashboard'}</span>
          </div>
          <div className="ml-auto flex items-center gap-2">
            <div className="relative hidden md:block">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input placeholder="Search..." className="h-9 w-56 pl-9" />
            </div>
            {mounted && (
              <Button variant="ghost" size="icon" onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}>
                {theme === 'dark' ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
              </Button>
            )}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <button className="flex items-center gap-2 rounded-lg p-1 transition-colors hover:bg-muted">
                  <Avatar className="h-8 w-8">
                    {userPhoto && <AvatarImage src={userPhoto} className="object-cover" />}
                    <AvatarFallback>{userName ? userName.substring(0, 2).toUpperCase() : 'U'}</AvatarFallback>
                  </Avatar>
                </button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-56">
                <DropdownMenuLabel>
                  <div className="flex flex-col">
                    <span className="text-sm font-medium">{userName}</span>
                    <span className="text-xs text-muted-foreground">{userEmail}</span>
                  </div>
                </DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem asChild><Link href="/dashboard/profile"><User className="mr-2 h-4 w-4" /> Profile</Link></DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={handleSignOut} asChild>
                  <Link href="/login">
                    <LogOut className="mr-2 h-4 w-4" /> Sign out
                  </Link>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </header>

        <main className="flex-1 p-4 sm:p-6 lg:p-8">{children}</main>
      </div>
    </div>
  );
}

function SidebarContent({ pathname, onNavigate }: { pathname: string; onNavigate?: () => void }) {
  return (
    <>
      <div className="flex h-16 items-center justify-between border-b px-5">
        <Link href="/" className="flex items-center gap-2">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-brand">
            <Sparkles className="h-4 w-4 text-white" />
          </div>
          <span className="font-bold">PortfolioForge</span>
        </Link>
        {onNavigate && (
          <Button variant="ghost" size="icon" onClick={onNavigate} className="lg:hidden">
            <X className="h-5 w-5" />
          </Button>
        )}
      </div>
      <nav className="flex-1 space-y-1 overflow-y-auto p-3">
        {navItems.map((item) => {
          const active = pathname === item.href || (item.href !== '/dashboard' && pathname.startsWith(item.href));
          return (
            <Link
              key={item.href}
              href={item.href}
              onClick={onNavigate}
              className={cn(
                'group flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors',
                active ? 'bg-primary/10 text-primary' : 'text-muted-foreground hover:bg-muted hover:text-foreground'
              )}
            >
              <item.icon className={cn('h-4.5 w-4.5', active ? 'text-primary' : 'text-muted-foreground group-hover:text-foreground')} />
              {item.label}
              {active && <motion.div layoutId="sidebar-active" className="ml-auto h-1.5 w-1.5 rounded-full bg-primary" />}
            </Link>
          );
        })}
      </nav>
      <div className="border-t p-3">
        <Link href="/builder" onClick={onNavigate}>
          <div className="group relative overflow-hidden rounded-xl bg-gradient-brand p-4 text-white">
            <div className="absolute inset-0 bg-grid-pattern opacity-20" />
            <div className="relative">
              <Rocket className="h-5 w-5" />
              <p className="mt-2 text-sm font-semibold">Build Portfolio</p>
              <p className="text-xs text-white/80">Create or edit your portfolio</p>
            </div>
          </div>
        </Link>
      </div>
    </>
  );
}
