import React, { createContext, useContext, useEffect, useState } from 'react';
import { User } from 'firebase/auth';
import { onUserChanged } from '../lib/auth';

interface AuthContextValue {
  user: User | null;
  isConnected: boolean;
}

const AuthContext = createContext<AuthContextValue>({ user: null, isConnected: false });

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    const unsubscribe = onUserChanged(setUser);
    return () => unsubscribe();
  }, []);

  return <AuthContext.Provider value={{ user, isConnected: !!user }}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  return useContext(AuthContext);
}
