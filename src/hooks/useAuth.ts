// useAuth.ts
import { useState, useEffect } from "react";

const useAuth = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [token, setToken] = useState<string | null>(null);

  useEffect(() => {
    const storedToken = localStorage.getItem("jwtToken");
    if (storedToken) {
      setToken(storedToken);
      setIsLoggedIn(true);
    }
  }, []);

  const login = async (username: string, password: string) => {
    // Remplacez cette URL par l'URL de votre API d'authentification
    const apiUrl = "https://your-api-url/login";

    const response = await fetch(apiUrl, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ username, password }),
    });

    if (response.ok) {
      const data = await response.json();
      const jwtToken = data.token;
      localStorage.setItem("jwtToken", jwtToken);
      setToken(jwtToken);
      setIsLoggedIn(true);
    } else {
      throw new Error("Login failed");
    }
  };

  const logout = () => {
    localStorage.removeItem("jwtToken");
    setToken(null);
    setIsLoggedIn(false);
  };

  return { isLoggedIn, token, login, logout };
};

export default useAuth;
