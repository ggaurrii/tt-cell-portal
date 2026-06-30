import React, { createContext, useContext, useState, useCallback } from 'react';
import { User, UserRole } from '@/types';

interface AuthContextType {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  login: (email: string, password: string, role: UserRole) => Promise<boolean>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | null>(null);

const MOCK_USERS: Record<string, { user: User; password: string }> = {
  'admin@ttcell.in': {
    password: 'admin123',
    user: { id: 'admin1', name: 'Lt. Col. Ramesh Kumar', email: 'admin@ttcell.in', role: 'admin', department: 'Training Wing', joinDate: '2022-01-01' },
  },
  'student@ttcell.in': {
    password: 'student123',
    user: { id: '1', name: 'Arjun Sharma', email: 'student@ttcell.in', role: 'student', studentId: 'TTC2025001', department: 'AI & Machine Learning', joinDate: '2025-01-15' },
  },
};

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(() => {
    const stored = localStorage.getItem('tt_user');
    return stored ? JSON.parse(stored) : null;
  });
  const [token, setToken] = useState<string | null>(() => localStorage.getItem('tt_token'));

  const login = useCallback(async (email: string, password: string, _role: UserRole): Promise<boolean> => {
    await new Promise(r => setTimeout(r, 800));
    const match = MOCK_USERS[email];
    if (match && match.password === password) {
      const mockToken = `mock_jwt_${Date.now()}`;
      setUser(match.user);
      setToken(mockToken);
      localStorage.setItem('tt_user', JSON.stringify(match.user));
      localStorage.setItem('tt_token', mockToken);
      return true;
    }
    return false;
  }, []);

  const logout = useCallback(() => {
    setUser(null);
    setToken(null);
    localStorage.removeItem('tt_user');
    localStorage.removeItem('tt_token');
  }, []);

  return (
    <AuthContext.Provider value={{ user, token, isAuthenticated: !!user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
}
