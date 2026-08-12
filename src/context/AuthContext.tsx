import React, { createContext, useContext, useEffect, useState } from 'react';
import { User } from 'firebase/auth';
import { subscribeToConnectedUser } from '../lib/auth';

interface AuthContextValue {
  user: User | null;
  isConnected: boolean;
}

const AuthContext = createContext<AuthContextValue>({ user: null, isConnected: false });

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    // Mirrors the exact same "connected" signal Conexoes.tsx sets after a
    // successful googleSignIn()/initAuth() resolution, instead of deriving
    // it independently from a second Firebase listener.
    return subscribeToConnectedUser(setUser);
  }, []);

  return <AuthContext.Provider value={{ user, isConnected: !!user }}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  return useContext(AuthContext);
}
