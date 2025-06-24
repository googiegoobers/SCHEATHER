// app/ClientProviders.tsx
'use client';
import { AuthContextProvider } from "@/app/context/AuthContext";

export function ClientProviders({ children }: { children: React.ReactNode }) {
  return <AuthContextProvider>{children}</AuthContextProvider>;
}