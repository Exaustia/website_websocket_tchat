import { useState, useEffect, createContext, useContext, ReactNode } from "react";
import fetchAPI from "../utils/fetch";
import { useAuthContext } from "./AuthProvider";
import { User } from "../types/User";

interface UserProviderState {
  user: User | null;
  isConnected: boolean;
  refreshUser?: () => void;
}

const UserContext = createContext<UserProviderState>({
  user: null,
  isConnected: false,
});

interface UserProviderProps {
  children: ReactNode;
}

export const UserProvider = ({ children }: UserProviderProps) => {
  const [isLoaded, setIsLoaded] = useState<boolean>(false);
  const [user, setUser] = useState<UserProviderState>({
    user: null,
    isConnected: false,
  });
  const { isLoggedIn, logout } = useAuthContext();

  const refreshUser = () => {
    fetchAPI("/user/me", { method: "GET" }).then((res) => {
      if (!res.error) {
        setUser({ user: res, isConnected: true });
      }
    });
  };

  useEffect(() => {
    if (!isLoggedIn || isLoaded) return;
    setIsLoaded(true);
    console.log("fetching user")
    fetchAPI("/user/me", { method: "GET" })
      .then((res) => {
        if (!res.error) {
          setUser({ user: res, isConnected: true });
        } else {
          setUser({ user: null, isConnected: false });
          logout();
        }
      })
      .finally(() => {
        setIsLoaded(false);
      });
  }, [isLoggedIn, logout]);

  const context = {
    refreshUser,
    ...user,
  };

  return <UserContext.Provider value={context}>{children}</UserContext.Provider>;
};

export const useUser = () => {
  return useContext(UserContext);
};
