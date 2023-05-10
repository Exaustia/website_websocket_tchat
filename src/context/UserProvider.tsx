import {
  useState,
  useEffect,
  createContext,
  useContext,
  ReactNode,
} from "react";
import fetchAPI from "../utils/fetch";
import { useAuthContext } from "./AuthProvider";
import { User } from "../types/User";

interface UserProviderState {
  user: User | null;
  isConnected: boolean;
}

const UserContext = createContext<UserProviderState>({
  user: null,
  isConnected: false,
});

interface UserProviderProps {
  children: ReactNode;
}

export const UserProvider = ({ children }: UserProviderProps) => {
  const [user, setUser] = useState<UserProviderState>({
    user: null,
    isConnected: false,
  });
  const { isLoggedIn } = useAuthContext();

  useEffect(() => {
    if (!isLoggedIn) return;
    fetchAPI("/user/me", { method: "GET" }).then((res) => {
      if (!res.error) {
        setUser({ user: res, isConnected: true });
      }
    });
  }, [isLoggedIn]);

  return <UserContext.Provider value={user}>{children}</UserContext.Provider>;
};

export const useUser = () => {
  return useContext(UserContext);
};
