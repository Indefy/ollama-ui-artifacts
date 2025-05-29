import React, { createContext, useContext, useState, useEffect } from 'react';

interface User {
  id: string;
  name: string;
  profileImage: string;
  bio?: string;
  url?: string;
}

interface AuthContextType {
  user: User | null;
  isLoading: boolean;
  login: (name?: string) => void;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Load saved user from localStorage
    const savedUserName = localStorage.getItem('pocket-ai-username');
    if (savedUserName) {
      setUser({
        id: 'local-user',
        name: savedUserName,
        profileImage: `https://ui-avatars.com/api/?name=${encodeURIComponent(savedUserName)}&background=667eea&color=fff`,
        bio: 'Local development user'
      });
    }
    setIsLoading(false);
  }, []);

  const login = (name?: string) => {
    const userName = name || prompt('Enter your name:') || 'Anonymous User';
    
    // Save to localStorage
    localStorage.setItem('pocket-ai-username', userName);
    
    setUser({
      id: 'local-user',
      name: userName,
      profileImage: `https://ui-avatars.com/api/?name=${encodeURIComponent(userName)}&background=667eea&color=fff`,
      bio: 'Local development user'
    });
  };

  const logout = () => {
    localStorage.removeItem('pocket-ai-username');
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, isLoading, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};
