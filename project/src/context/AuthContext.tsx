import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { User, UserRole } from '../types/user';

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (email: string, password: string, name: string) => Promise<void>;
  logout: () => void;
  hasPermission: (permission: string) => boolean;
}

// Create context
const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Mock users for demonstration
const MOCK_USERS = [
  {
    id: '1',
    name: 'Alex J Mathew',
    email: 'alexjmathewthottiyil123@gmail.com',
    role: 'admin' as UserRole,
    avatar: 'https://images.pexels.com/photos/220453/pexels-photo-220453.jpeg?auto=compress&cs=tinysrgb&w=150',
    createdAt: new Date(2023, 1, 15).toISOString(),
  },
  {
    id: '2',
    name: 'Regular User',
    email: 'user@example.com',
    role: 'user' as UserRole,
    avatar: 'https://images.pexels.com/photos/1239291/pexels-photo-1239291.jpeg?auto=compress&cs=tinysrgb&w=150',
    createdAt: new Date(2023, 3, 20).toISOString(),
  }
];

// Permission mappings
const ROLE_PERMISSIONS = {
  admin: [
    'landmark:create', 'landmark:update', 'landmark:delete', 'landmark:view',
    'route:create', 'route:update', 'route:delete', 'route:view',
    'user:manage', 'content:moderate', 'analytics:view',
    'landmark:update:any', 'landmark:delete:any',
    'route:update:any', 'route:delete:any'
  ],
  user: [
    'landmark:create', 'landmark:update:own', 'landmark:delete:own', 'landmark:view',
    'route:create', 'route:update:own', 'route:delete:own', 'route:view'
  ]
};

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Check if user is already logged in
  useEffect(() => {
    const storedUser = localStorage.getItem('mapmaster-user');
    if (storedUser) {
      try {
        setUser(JSON.parse(storedUser));
      } catch (e) {
        console.error('Failed to parse stored user data', e);
        localStorage.removeItem('mapmaster-user');
      }
    }
    setIsLoading(false);
  }, []);

  // Login function
  const login = async (email: string, password: string) => {
    setIsLoading(true);
    try {
      // In a real app, this would be an API call
      // Simulating authentication delay
      await new Promise(resolve => setTimeout(resolve, 800));
      
      const foundUser = MOCK_USERS.find(u => u.email === email);
      
      if (!foundUser) {
        throw new Error('Invalid credentials');
      }
      
      // In a real app, password would be verified
      // For demo purposes, any password works
      
      setUser(foundUser);
      localStorage.setItem('mapmaster-user', JSON.stringify(foundUser));
    } catch (error) {
      console.error('Login error:', error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  // Register function
  const register = async (email: string, password: string, name: string) => {
    setIsLoading(true);
    try {
      // In a real app, this would be an API call
      // Simulating registration delay
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Check if user already exists
      if (MOCK_USERS.some(u => u.email === email)) {
        throw new Error('User already exists');
      }
      
      // Create a new user with user role
      const newUser: User = {
        id: `${MOCK_USERS.length + 1}`,
        name,
        email,
        role: 'user',
        avatar: 'https://images.pexels.com/photos/1851164/pexels-photo-1851164.jpeg?auto=compress&cs=tinysrgb&w=150',
        createdAt: new Date().toISOString(),
      };
      
      // In a real app, this would be saved to a database
      // For demo, we just set the current user
      setUser(newUser);
      localStorage.setItem('mapmaster-user', JSON.stringify(newUser));
    } catch (error) {
      console.error('Registration error:', error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  // Logout function
  const logout = () => {
    setUser(null);
    localStorage.removeItem('mapmaster-user');
  };

  // Check if user has a specific permission
  const hasPermission = (permission: string) => {
    if (!user) return false;
    const userPermissions = ROLE_PERMISSIONS[user.role] || [];
    return userPermissions.includes(permission);
  };

  return (
    <AuthContext.Provider 
      value={{ 
        user, 
        isAuthenticated: !!user, 
        isLoading, 
        login, 
        register, 
        logout,
        hasPermission
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}