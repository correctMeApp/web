// provider.tsx
"use client";
import { SessionProvider } from "next-auth/react";
import { AuthProvider } from "./authContext";
import { NavigationEvents } from "@/components/ui/navigationEvents";
import { Suspense } from "react";

export function Providers({children}: {children: React.ReactNode}) {
  return <SessionProvider>
    <AuthProvider>
      {children}
      <Suspense fallback={null}>
          <NavigationEvents />
        </Suspense>
    </AuthProvider>
  </SessionProvider>;
}