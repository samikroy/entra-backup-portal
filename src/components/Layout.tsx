
import { ReactNode } from 'react';
import Header from './Header';
import Sidebar from './Sidebar';
import { useTheme } from '@/contexts/ThemeContext';

interface LayoutProps {
  children: ReactNode;
}

const Layout: React.FC<LayoutProps> = ({ children }) => {
  const { theme } = useTheme();
  
  return (
    <div className={`flex min-h-screen ${theme}`}>
      <Sidebar />
      <div className="flex flex-col flex-1">
        <Header />
        <main className="flex-1 p-6 container">{children}</main>
      </div>
    </div>
  );
};

export default Layout;
