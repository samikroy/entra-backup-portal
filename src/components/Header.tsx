
import { Button } from '@/components/ui/button';
import { useAuth } from '@/contexts/AuthContext';
import { useTheme } from '@/contexts/ThemeContext';
import Logo from './Logo';
import MainNav from './MainNav';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger
} from '@/components/ui/dropdown-menu';
import { Moon, Sun, Palette, Circle } from 'lucide-react';

const Header = () => {
  const { user, isAdmin, logout, isDevelopmentMode } = useAuth();
  const { theme, setTheme } = useTheme();
  // console.log("user", user);
  // console.log("isadmin", isAdmin);

  const themes = [
    { name: 'Light', value: 'light', icon: <Sun className="h-4 w-4 mr-2" /> },
    { name: 'Dark', value: 'dark', icon: <Moon className="h-4 w-4 mr-2" /> },
    { name: 'Azure', value: 'azure', icon: <Circle className="h-4 w-4 mr-2 text-azure-500" /> },
    { name: 'Corporate', value: 'corporate', icon: <Palette className="h-4 w-4 mr-2" /> },
  ];

  return (
    <header className="border-b">
      <div className="flex h-16 items-center px-4 sm:px-6">
        <div className="md:hidden">
          <Logo />
        </div>
        <MainNav className="hidden md:flex mx-6" />
        <div className="ml-auto flex items-center space-x-4">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" size="icon">
                {theme === 'light' && <Sun className="h-[1.2rem] w-[1.2rem]" />}
                {theme === 'dark' && <Moon className="h-[1.2rem] w-[1.2rem]" />}
                {theme === 'azure' && <Circle className="h-[1.2rem] w-[1.2rem] text-azure-500" />}
                {theme === 'corporate' && <Palette className="h-[1.2rem] w-[1.2rem]" />}
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              {themes.map((t) => (
                <DropdownMenuItem
                  key={t.value}
                  onClick={() => setTheme(t.value as any)}
                  className={theme === t.value ? "bg-accent text-accent-foreground" : ""}
                >
                  {t.icon}
                  {t.name}
                </DropdownMenuItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>

          <div className="flex items-center gap-4">
            {isDevelopmentMode && (
              <span className="text-xs text-muted-foreground bg-secondary px-2 py-1 rounded-md">Dev Mode</span>
            )}
            <span className="text-sm font-medium">{user?.name}</span>
            <Button variant="outline" size="sm" onClick={logout}>
              Logout
            </Button>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
