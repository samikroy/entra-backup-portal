
import { Button } from '@/components/ui/button';
import { useAuth } from '@/contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import { useEffect } from 'react';
import Logo from '@/components/Logo';

const Login = () => {
  const { login, isAuthenticated, isDevelopmentMode } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (isAuthenticated) {
      navigate('/', { replace: true });
    }
  }, [isAuthenticated, navigate]);

  const handleLogin = async () => {
    try {
      await login();
      navigate('/', { replace: true });
    } catch (error) {
      console.error('Login failed:', error);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-muted/30">
      <div className="max-w-md w-full p-8 bg-card rounded-lg shadow-lg flex flex-col items-center">
        <div className="mb-8">
          <Logo size="large" />
        </div>
        <h1 className="text-2xl font-bold text-center mb-2">Entra Vault Keeper</h1>
        <p className="text-muted-foreground text-center mb-8">
          Secure backup and restore solution for Azure AD (Microsoft Entra ID)
        </p>
        
        <Button 
          className="w-full mb-4 bg-azure-500 hover:bg-azure-600"
          onClick={handleLogin}
        >
          Sign in with Microsoft Entra ID
        </Button>

        {isDevelopmentMode && (
          <div className="text-sm text-center text-muted-foreground p-2 bg-muted rounded-md">
            Running in development mode with mock authentication
          </div>
        )}
      </div>
    </div>
  );
};

export default Login;
