import { createContext, useState, useEffect, ReactNode } from 'react';
import { technicianLogin, userLogin } from '../api/apiMethods';

// Define types
type UserRole = 'user' | 'technician';

interface User {
  id: string;
  role: UserRole;
  token: string;
  [key: string]: any; // For additional user properties
}

interface AuthContextType {
  isAuthenticated: boolean;
  userRole: UserRole | null;
  user: User | null;
  userId: string | null;
  loading: boolean;
  login: (role: UserRole, credentials: { phoneNumber: string; password: string }) => Promise<void>;
  logout: () => void;
}

interface AuthProviderProps {
  children: ReactNode;
}

// Create the AuthContext
export const AuthContext = createContext<AuthContextType | undefined>(undefined);

// AuthProvider component to wrap the app and provide auth state
export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [userRole, setUserRole] = useState<UserRole | null>(null);
  const [user, setUser] = useState<User | null>(null);
  const [userId, setUserId] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  // Check authentication status on mount
  useEffect(() => {
    const checkAuth = async () => {
      try {
        const token = localStorage.getItem('jwt_token');
        const role = localStorage.getItem('role') as UserRole | null;
        const userId = localStorage.getItem('userId');
        const userData = localStorage.getItem('user');

        if (token && role && userId && userData) {
          setIsAuthenticated(true);
          setUserRole(role);
          setUserId(userId);
          setUser(JSON.parse(userData));
        }
      } catch (error) {
        console.error('Auth check failed:', error);
      } finally {
        setLoading(false);
      }
    };

    checkAuth();
  }, []);

  // Login function
  const login = async (role: UserRole, credentials: { phoneNumber: string; password: string }) => {
    try {
      let response;
      if (role === 'technician') {
        response = await technicianLogin(credentials);
      } else {
        response = await userLogin(credentials);
      }

      if (response?.result?.token) {
        localStorage.setItem('jwt_token', response.result.token);
        localStorage.setItem('user', JSON.stringify(response.result));
        localStorage.setItem('userId', response.result.id);
        localStorage.setItem('role', response.result.role);

        setIsAuthenticated(true);
        setUserRole(response.result.role);
        setUserId(response.result.id);
        setUser(response.result);

        window.dispatchEvent(new Event('cartUpdated'));
      } else {
        throw new Error('Invalid credentials or server error');
      }
    } catch (error) {
      console.error('Login failed:', error);
      throw error;
    }
  };

  // Logout function
  const logout = () => {
    localStorage.removeItem('jwt_token');
    localStorage.removeItem('user');
    localStorage.removeItem('userId');
    localStorage.removeItem('role');
    setIsAuthenticated(false);
    setUserRole(null);
    setUserId(null);
    setUser(null);
    window.dispatchEvent(new Event('cartUpdated'));
  };

  // Context value
  const value: AuthContextType = {
    isAuthenticated,
    userRole,
    user,
    userId,
    loading,
    login,
    logout,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};