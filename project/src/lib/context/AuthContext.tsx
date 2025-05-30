import React, { createContext, useContext } from 'react';

interface User {
  username: string;
  email: string;
}

interface AuthContextType {
  user: User | null;
  loading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // 由于我们现在使用静态文件系统，这里可以设置一个默认用户或者 null
  const user = {
    username: 'Desert Eagle',
    email: 'desert@example.com'
  };

  return (
    <AuthContext.Provider value={{ user, loading: false }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};