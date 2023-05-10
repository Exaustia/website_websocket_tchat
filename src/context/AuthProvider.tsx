import React, { ReactNode, createContext, useContext } from "react";
import useAuth from "../hooks/useAuth";

interface IAuthState {
  isLoggedIn: boolean;
  token: string | null;
  provider: string | null;
  status: "connecting" | "disconnected" | "connected";
  loginETH: CallableFunction;
  logout: () => void;
}

const AuthContext = createContext<IAuthState | null>(null);

interface AuthProviderProps {
  children: ReactNode;
}

export function AuthProvider({ children }: AuthProviderProps) {
  const auth = useAuth();

  return <AuthContext.Provider value={auth}>{children}</AuthContext.Provider>;
}

export function useAuthContext() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuthContext must be used within an AuthProvider");
  }
  return context;
}
