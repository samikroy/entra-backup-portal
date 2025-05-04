
import { Button } from '@/components/ui/button';
import { useAuth } from '@/contexts/AuthContext';
import Logo from './Logo';
import MainNav from './MainNav';

const Header = () => {
  const { user, logout, isDevelopmentMode } = useAuth();

  return (
    <header className="border-b">
      <div className="flex h-16 items-center px-4 sm:px-6">
        <Logo />
        <MainNav className="mx-6" />
        <div className="ml-auto flex items-center space-x-4">
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
