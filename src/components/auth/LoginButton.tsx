import React from 'react';
import { LogIn, LogOut } from 'lucide-react';
import { Button } from '../ui/button';
import { useAuth } from './AuthProvider';

export const LoginButton: React.FC = () => {
  const { user, isLoading, login, logout } = useAuth();

  if (isLoading) {
    return <Button disabled>Loading...</Button>;
  }

  if (user) {
    return (
      <div className="flex items-center space-x-2">
        <div className="flex items-center space-x-2 text-white">
          <img 
            src={user.profileImage} 
            alt={user.name}
            className="w-6 h-6 rounded-full"
          />
          <span className="text-sm">{user.name}</span>
        </div>
        <Button onClick={logout} variant="outline" size="sm">
          <LogOut size={16} className="mr-1" />
          Logout
        </Button>
      </div>
    );
  }

  return (
    <Button onClick={() => login()} variant="outline">
      <LogIn size={16} className="mr-2" />
      Set Name
    </Button>
  );
};

export default LoginButton;
