
import { NavLink } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { cn } from '@/lib/utils';
import { 
  LayoutDashboard, 
  Server, 
  Save, 
  History, 
  Settings as SettingsIcon,
  Users
} from 'lucide-react';

const Sidebar = () => {
  const { user, isDevelopmentMode } = useAuth();

  const isAdmin = user?.name?.toLowerCase().includes('admin') || isDevelopmentMode;

  const navItems = [
    { name: 'Dashboard', path: '/', icon: <LayoutDashboard className="h-5 w-5" /> },
    { name: 'Tenants', path: '/tenants', icon: <Server className="h-5 w-5" /> },
    { name: 'Backups', path: '/backups', icon: <Save className="h-5 w-5" /> },
    { name: 'Restore', path: '/restore', icon: <History className="h-5 w-5" /> },
    { name: 'Settings', path: '/settings', icon: <SettingsIcon className="h-5 w-5" /> },
  ];

  if (isAdmin) {
    navItems.push({ name: 'Tenant Admin', path: '/admin', icon: <Users className="h-5 w-5" /> });
  }

  return (
    <div className="hidden md:flex flex-col w-64 bg-sidebar text-sidebar-foreground border-r border-sidebar-border">
      <div className="p-6">
        <h2 className="text-xl font-bold text-sidebar-primary">Entra backup</h2>
        <p className="text-xs text-sidebar-foreground/70 mt-1">Secure Backup & Restore</p>
      </div>
      
      <nav className="flex-1 px-4 pb-4">
        <ul className="space-y-1">
          {navItems.map((item) => (
            <li key={item.path}>
              <NavLink
                to={item.path}
                className={({ isActive }) => cn(
                  "flex items-center gap-3 rounded-md px-3 py-2 transition-all",
                  isActive 
                    ? "bg-sidebar-accent text-sidebar-accent-foreground font-medium" 
                    : "text-sidebar-foreground hover:bg-sidebar-accent/50 hover:text-sidebar-accent-foreground"
                )}
              >
                {item.icon}
                <span>{item.name}</span>
              </NavLink>
            </li>
          ))}
        </ul>
      </nav>
      
      <div className="p-4 border-t border-sidebar-border">
        <div className="text-xs text-sidebar-foreground/70">
          {isDevelopmentMode ? 'Development Mode' : 'Production Mode'}
        </div>
      </div>
    </div>
  );
};

export default Sidebar;
