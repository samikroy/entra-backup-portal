
import React from 'react';
import { NavLink } from 'react-router-dom';
import { cn } from '@/lib/utils';

interface MainNavProps {
  className?: string;
}

const MainNav: React.FC<MainNavProps> = ({ className }) => {
  return (
    <nav className={cn('flex items-center space-x-4 lg:space-x-6', className)}>
      <NavLink 
        to="/" 
        end
        className={({ isActive }) => 
          cn(
            'text-sm font-medium transition-colors hover:text-primary',
            isActive ? 'text-primary' : 'text-muted-foreground'
          )
        }
      >
        Dashboard
      </NavLink>
      <NavLink 
        to="/tenants" 
        className={({ isActive }) => 
          cn(
            'text-sm font-medium transition-colors hover:text-primary',
            isActive ? 'text-primary' : 'text-muted-foreground'
          )
        }
      >
        Tenants
      </NavLink>
      <NavLink 
        to="/backups" 
        className={({ isActive }) => 
          cn(
            'text-sm font-medium transition-colors hover:text-primary',
            isActive ? 'text-primary' : 'text-muted-foreground'
          )
        }
      >
        Backups
      </NavLink>
      <NavLink 
        to="/restore" 
        className={({ isActive }) => 
          cn(
            'text-sm font-medium transition-colors hover:text-primary',
            isActive ? 'text-primary' : 'text-muted-foreground'
          )
        }
      >
        Restore
      </NavLink>
      <NavLink 
        to="/settings" 
        className={({ isActive }) => 
          cn(
            'text-sm font-medium transition-colors hover:text-primary',
            isActive ? 'text-primary' : 'text-muted-foreground'
          )
        }
      >
        Settings
      </NavLink>
    </nav>
  );
};

export default MainNav;
