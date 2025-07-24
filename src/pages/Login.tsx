
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import { useEffect } from 'react';
import Logo from '@/components/Logo';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useTheme } from '@/contexts/ThemeContext';

const Login = () => {
  const { login, isAuthenticated, isDevelopmentMode } = useAuth();
  const { theme } = useTheme();
  const navigate = useNavigate();
  const [loginType, setLoginType] = useState<'admin' | 'user'>('admin');

  // useEffect(() => {
  //   if (isAuthenticated) {
  //     navigate('/', { replace: true });
  //   }
  // }, [isAuthenticated, navigate]);

  const handleLogin = async () => {
    try {
      await login(loginType === 'admin');
      navigate('/', { replace: true });
    } catch (error) {
      console.error('Login failed:', error);
    }
  };

  return (
    <div className={`flex items-center justify-center min-h-screen bg-muted/30 ${theme}`}>
      <div className="max-w-md w-full p-8 bg-card rounded-lg shadow-lg flex flex-col items-center">
        <div className="mb-8">
          <Logo size="large" />
        </div>
        <h1 className="text-2xl font-bold text-center mb-2">Entra Vault Keeper</h1>
        <p className="text-muted-foreground text-center mb-8">
          Secure backup and restore solution for Azure AD (Microsoft Entra ID)
        </p>
        
        {isDevelopmentMode && (
          <Tabs value={loginType} onValueChange={(v) => setLoginType(v as 'admin' | 'user')} className="mb-6">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="admin">Admin Login</TabsTrigger>
              <TabsTrigger value="user">User Login</TabsTrigger>
            </TabsList>
          </Tabs>
        )}
        
        <Button 
          className="w-full mb-4"
          onClick={handleLogin}
        >
          Sign in with Microsoft Entra ID
        </Button>

        {isDevelopmentMode && (
          <div className="text-sm text-center text-muted-foreground p-2 bg-muted rounded-md">
            Running in development mode with mock authentication
            <br/>
            <span className="font-medium">
              {loginType === 'admin' ? 'Administrator' : 'Standard User'} Mode
            </span>
          </div>
        )}
      </div>
    </div>
  );
};

export default Login;
