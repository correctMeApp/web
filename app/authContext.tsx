'use client'
// utils/authContext.tsx
import React, { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { getURL } from '@/utils/helpers';
import { usePathname, useSearchParams } from 'next/navigation';
import { SessionProvider } from 'next-auth/react';

interface AuthContextData {
  isLoggedIn: boolean;
}

interface AuthProviderProps {
  children: ReactNode;
}

const AuthContext = createContext<AuthContextData>({ isLoggedIn: false });

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const pathname = usePathname();
  const searchParams = useSearchParams();

  useEffect(() => {
    const checkIsLoggedIn = async () => {
      const response = await fetch(getURL('/api/isLoggedIn'), {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'same-origin',
      });
      const data = await response.json();
      setIsLoggedIn(data.isLoggedIn);
    };

    checkIsLoggedIn();
  }, [pathname, searchParams]);

  return (
    <AuthContext.Provider value={{ isLoggedIn }}>
        <SessionProvider>
      {children}
      </SessionProvider>
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);