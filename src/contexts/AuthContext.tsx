import { createContext, useContext, useState, ReactNode } from 'react';

type UserType = 'employer' | 'employee' | 'agent';

interface AuthUser {
  id: string;
  email: string;
  name: string;
  type: UserType;
}

interface AuthContextType {
  user: AuthUser | null;
  login: (email: string, password: string, type: UserType) => void;
  logout: () => void;
  isAuthenticated: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<AuthUser | null>(null);

  const login = (email: string, password: string, type: UserType) => {
    // Mock login - in real app, this would make an API call
    setUser({
      id: '1',
      email,
      name: 'Test User',
      type,
    });
  };

  const logout = () => {
    setUser(null);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        login,
        logout,
        isAuthenticated: !!user,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
} 