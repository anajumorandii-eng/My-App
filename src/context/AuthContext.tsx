import React, { createContext, useContext, useEffect, useState } from 'react';
import { User } from 'firebase/auth';
import { subscribeToConnectedUser } from '../lib/auth';

interface AuthContextValue {
  user: User | null;
  isConnected: boolean;
  loading: boolean;
}

const AuthContext = createContext<AuthContextValue>({ user: null, isConnected: false, loading: true });

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Mirrors the exact same "connected" signal Conexoes.tsx sets after a
    // successful googleSignIn()/initAuth() resolution, instead of deriving
    // it independently from a second Firebase listener.
    return subscribeToConnectedUser((connectedUser) => {
      setUser(connectedUser);
      setLoading(false);
    });
  }, []);

  return <AuthContext.Provider value={{ user, isConnected: !!user, loading }}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  return useContext(AuthContext);
}
