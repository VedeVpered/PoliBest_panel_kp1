import { ReactNode, useState } from 'react';
import { Link, useLocation } from 'wouter';
import { 
  LayoutDashboard, 
  Calculator, 
  FileText, 
  Briefcase, 
  FolderOpen, 
  BookOpen, 
  PlayCircle, 
  Wrench, 
  Settings, 
  LogOut,
  X,
  Menu
} from 'lucide-react';
import { Button } from '@/components/ui/button';

interface LayoutProps {
  children: ReactNode;
}

const navItems = [
  { path: '/', label: 'ПАНЕЛЬ', icon: LayoutDashboard },
  { path: '/calculator', label: 'КАЛЬКУЛЯТОР', icon: Calculator },
  { path: '/calculations', label: 'РОЗРАХУНКИ', icon: FileText },
  { path: '/commercial', label: 'КОМЕРЦІЙНЕ', icon: Briefcase },
  { path: '/documents', label: 'ДОКУМЕНТИ', icon: FolderOpen },
  { path: '/instructions', label: 'ІНСТРУКЦІЇ', icon: BookOpen },
  { path: '/video', label: 'ВІДЕО', icon: PlayCircle },
  { path: '/services', label: 'СЕРВІСИ', icon: Wrench },
  { path: '/settings', label: 'НАЛАШТУВАННЯ', icon: Settings },
];

// Bottom navigation items (first 4)
const bottomNavItems = navItems.slice(0, 4);

// Original colors from kpwizard.emergent.host
const PRIMARY_COLOR = '#b8391a';
const ACTIVE_BG = '#1c1c1c';

export default function Layout({ children }: LayoutProps) {
  const [location] = useLocation();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const isActive = (path: string) => {
    if (path === '/') return location === '/';
    return location.startsWith(path);
  };

  const handleNavClick = () => {
    setMobileMenuOpen(false);
  };

  const getCurrentPageTitle = () => {
    const currentItem = navItems.find(item => isActive(item.path));
    return currentItem?.label || 'ПАНЕЛЬ';
  };

  return (
    <div className="flex min-h-screen bg-[#0a0a0a]">
      {/* Desktop Sidebar */}
      <aside className="hidden lg:flex w-52 bg-[#0f0f0f] border-r border-[#262626] flex-col fixed h-full">
        {/* Logo */}
        <div className="p-4 border-b border-[#262626]">
          <h1 className="text-xl font-bold tracking-wide">
            <span style={{ color: PRIMARY_COLOR }}>POLI</span>
            <span className="text-white">BEST</span>
            <span className="text-white ml-1">911</span>
          </h1>
        </div>

        {/* Navigation */}
        <nav className="flex-1 py-2">
          {navItems.map((item) => {
            const Icon = item.icon;
            const active = isActive(item.path);
            return (
              <Link key={item.path} href={item.path}>
                <div
                  className={`flex items-center gap-3 px-4 py-2.5 text-sm font-medium transition-colors border-l-2 ${
                    active
                      ? 'border-l-2'
                      : 'text-[#a3a3a3] hover:text-white hover:bg-white/5 border-transparent'
                  }`}
                  style={active ? { 
                    backgroundColor: ACTIVE_BG, 
                    color: PRIMARY_COLOR, 
                    borderLeftColor: PRIMARY_COLOR 
                  } : {}}
                >
                  <Icon className="w-4 h-4" />
                  {item.label}
                </div>
              </Link>
            );
          })}
        </nav>

        {/* Footer */}
        <div className="p-4 border-t border-[#262626]">
          <Button
            variant="ghost"
            className="w-full justify-start gap-3 text-[#a3a3a3] hover:text-white"
          >
            <LogOut className="w-4 h-4" />
            ВИЙТИ
          </Button>
          <p className="text-xs text-[#525252] mt-2 text-center">v1.0.0</p>
        </div>
      </aside>

      {/* Mobile Header - always visible */}
      <div className="lg:hidden fixed top-0 left-0 right-0 z-40 bg-[#0a0a0a] border-b border-[#262626] px-4 py-3 flex items-center justify-between">
        <h1 className="text-lg font-bold">
          <span style={{ color: PRIMARY_COLOR }}>Poli</span>
          <span className="text-white">Best</span>
        </h1>
        <span className="text-white font-medium text-sm">{getCurrentPageTitle()}</span>
        <button
          className="text-white p-1"
          onClick={() => setMobileMenuOpen(true)}
        >
          <Menu className="w-6 h-6" />
        </button>
      </div>

      {/* Mobile Full-Screen Menu Overlay */}
      {mobileMenuOpen && (
        <div className="lg:hidden fixed inset-0 z-50 bg-[#0a0a0a] flex flex-col">
          {/* Mobile Menu Header */}
          <div className="flex items-center justify-between px-4 py-3 border-b border-[#262626]">
            <h1 className="text-lg font-bold">
              <span style={{ color: PRIMARY_COLOR }}>Poli</span>
              <span className="text-white">Best</span>
            </h1>
            <span className="text-white font-medium text-sm">{getCurrentPageTitle()}</span>
            <button
              className="text-white p-1"
              onClick={() => setMobileMenuOpen(false)}
            >
              <X className="w-6 h-6" />
            </button>
          </div>

          {/* Mobile Menu Items - full screen list */}
          <nav className="flex-1 overflow-y-auto">
            {navItems.map((item) => {
              const Icon = item.icon;
              const active = isActive(item.path);
              return (
                <Link key={item.path} href={item.path} onClick={handleNavClick}>
                  <div
                    className={`flex items-center gap-5 px-5 py-5 text-base transition-colors ${
                      active
                        ? ''
                        : 'text-[#d4d4d4]'
                    }`}
                    style={active ? { backgroundColor: ACTIVE_BG, color: PRIMARY_COLOR } : {}}
                  >
                    <Icon className="w-5 h-5 flex-shrink-0" />
                    <span className="font-medium">{item.label}</span>
                  </div>
                </Link>
              );
            })}
            
            {/* Version info */}
            <div className="px-5 py-4 text-[#525252] text-xs">
              PoliBest 911 v1.0.0
            </div>
          </nav>

          {/* Bottom Navigation Bar in Menu */}
          <div className="border-t border-[#262626] bg-[#0a0a0a] grid grid-cols-4">
            {bottomNavItems.map((item) => {
              const Icon = item.icon;
              const active = isActive(item.path);
              return (
                <Link key={item.path} href={item.path} onClick={handleNavClick}>
                  <div className={`flex flex-col items-center justify-center py-3 ${
                    active ? 'text-white' : 'text-[#737373]'
                  }`}>
                    <Icon className="w-5 h-5 mb-1" />
                    <span className="text-[9px] font-medium uppercase">{item.label}</span>
                  </div>
                </Link>
              );
            })}
          </div>
        </div>
      )}

      {/* Main Content */}
      <main className="flex-1 lg:ml-52 p-4 lg:p-6 bg-[#0a0a0a] pt-16 lg:pt-6 pb-6">
        {children}
      </main>
    </div>
  );
}
