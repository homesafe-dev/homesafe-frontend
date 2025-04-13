export type UserType = 'employer' | 'employee' | 'agent';

export interface AuthUser {
  id: string;
  email: string;
  name: string;
  type: UserType;
}

export interface AuthContextType {
  user: AuthUser | null;
  login: (email: string, password: string, type: UserType) => void;
  logout: () => void;
  isAuthenticated: boolean;
}
