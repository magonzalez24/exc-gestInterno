import { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { Home, ChevronLeft, ChevronRight, Users, FolderKanban } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useI18n } from '@/i18n';

import { cn } from '@/lib/utils';
import { useAuth } from '@/context/useAuth';
import LogoExcelia from '@/assets/excelia.jpg';

type UserRole = 'MANAGER' | 'DIRECTOR' | string;

interface NavItem {
  title: string;
  href: string;
  icon: React.ComponentType<{ className?: string }>;
  roles?: UserRole[];
}

const navItems: NavItem[] = [
  { title: 'sidebar.home', href: '/home', icon: Home },
  //{
  //  title: 'sidebar.dashboard',
  //  href: '/dashboard',
  //  icon: LayoutDashboard,
  //  roles: ['MANAGER', 'DIRECTOR'],
  //},
  { title: 'sidebar.employees', href: '/employees', icon: Users },
  { title: 'sidebar.projects', href: '/proyects', icon: FolderKanban },

  //{ title: 'sidebar.settings', href: '/settings', icon: Settings },
];

export const Sidebar = () => {
  const location = useLocation();
  const { user } = useAuth();
  const { t } = useI18n();
  const [isCollapsed, setIsCollapsed] = useState(false);
  const navigate = useNavigate(); 
  const filteredNavItems = navItems.filter((item) => {
    if (!item.roles) return true;
    return user && typeof user.role === 'string' && item.roles.includes(user.role as UserRole);
  });

  const handleToggleSidebar = () => {
    setIsCollapsed((prev) => !prev);
  };

  return (
    <div
      className={cn(
        'flex h-full flex-col border-r bg-background transition-all duration-300',
        isCollapsed ? 'w-20' : 'w-64'
      )}
    >
      <div className="flex h-16 items-center justify-between border-b px-4">
        {!isCollapsed && (
          <div className="text-xl font-bold text-primary">
            <img src={LogoExcelia} alt="Logo" className="h-8" />
          </div>
        )}
        <Button
          onClick={handleToggleSidebar}
          className={cn(
            'flex items-center justify-center rounded-lg p-2 text-muted-foreground transition-colors hover:bg-accent hover:text-accent-foreground',
            isCollapsed && 'mx-auto'
          )}
          aria-label={isCollapsed ? 'Expandir sidebar' : 'Contraer sidebar'}
        >
          {isCollapsed ? (
            <ChevronRight className="h-5 w-5" />
          ) : (
            <ChevronLeft className="h-5 w-5" />
          )}
        </Button>
      </div>
      <nav className="flex-1 space-y-1 p-4">
        {filteredNavItems.map((item) => {
          const Icon = item.icon;
          const isActive =
            location.pathname === item.href ||
            (item.href !== '/' && location.pathname.startsWith(item.href));

          return (
            <Button
              key={item.href}
              onClick={() => navigate(item.href)}
              className={cn(
                'flex items-left justify-start cursor-pointer gap-3 rounded-lg w-full py-3 text-sm font-medium transition-colors hover:bg-blue-900 hover:text-white',
                isActive
                  ? 'bg-blue-300 text-primary-foreground'
                  : 'text-muted-foreground hover:bg-accent hover:text-accent-foreground',
                isCollapsed && 'justify-center'
              )}
              title={isCollapsed ? t(item.title) : undefined}
            >
              <Icon className="h-5 w-5 flex-shrink-0" />
              {!isCollapsed && <span>{t(item.title)}</span>}
            </Button>
          );
        })}
      </nav>
    </div>
  );
};

