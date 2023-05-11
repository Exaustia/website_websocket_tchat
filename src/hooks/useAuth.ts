// useAuth.ts
import { useWallet } from "@solana/wallet-adapter-react";
import { useState, useEffect } from "react";
import { useDisconnect } from "wagmi";
import { encodeBase64 } from "tweetnacl-util";
import Web3 from "web3";

const web3 = new Web3(Web3.givenProvider);

const useAuth = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const { disconnect } = useDisconnect();
  const { disconnect: disconnectSolana, signMessage } = useWallet();
  const [status, setStatus] = useState<
    "connecting" | "disconnected" | "connected"
  >("connecting"); // ["connected", "disconnected", "error", "connecting"]

  const [provider, setProvider] = useState<string | null>(null);
  const [token, setToken] = useState<string | null>(null);

  useEffect(() => {
    const storedToken = localStorage.getItem("jpg_fm_session");
    if (storedToken) {
      const session = JSON.parse(storedToken);
      setToken(session.accessToken);
      setProvider(session.provider);
      setIsLoggedIn(true);
      setStatus("connected");
    } else {
      setStatus("disconnected");
    }
  }, []);

  // verify each 10 minutes if the token is still valid
  useEffect(() => {
    const interval = setInterval(async () => {
      if (token) {
        const data = await fetch("http://localhost:8080/login/verifySession", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            token,
          }),
        });
        const { valid } = await data.json();
        if (!valid) {
          console.log("invalid");
          logout();
        }
      }
    }, 600000);
    return () => clearInterval(interval);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [token]);

  const loginSolana = async (selectedAddress: string) => {
    try {
      if (token) return;
      const data = await fetch("http://localhost:8080/login/nonce", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          address: selectedAddress,
        }),
      });

      const { message } = await data.json();

      const msg = new TextEncoder().encode(message);

      if (!signMessage) return console.log("signMessage is null");
      const signedMessage = await signMessage(msg);
      
      const msgString = encodeBase64(signedMessage);

      const dataToken = await fetch("http://localhost:8080/login/solana", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          publicKey: selectedAddress,
          signedMessage: msgString,
        }),
      });
      const { accessToken, provider } = await dataToken.json();
      if (!accessToken) return console.log("accessToken is null");

      const session = {
        provider,
        accessToken,
      };

      setToken(accessToken);
      setProvider(provider);
      setIsLoggedIn(true);
      setStatus("connected");
      window.localStorage.setItem("jpg_fm_session", JSON.stringify(session));
      return token;
    } catch (err) {
      console.error(err);
      return null;
    }
  };

  const loginETH = async (selectedAddress: string) => {
    try {
      if (token) return;
      const data = await fetch("http://localhost:8080/login/nonce", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          address: selectedAddress,
        }),
      });

      const { message } = await data.json();

      const from = selectedAddress;
      const msg = `${web3.utils.utf8ToHex(message)}`;
      // const msg = `0x0otot`;
      const sign = await web3.eth.personal
        .sign(msg, from, "")
        .then((res) => res);

      const dataToken = await fetch("http://localhost:8080/login/eth", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          address: selectedAddress,
          signature: sign,
        }),
      });
      const { accessToken } = await dataToken.json();

      const session = {
        provider: "eth",
        accessToken,
      };

      setToken(accessToken);
      setProvider("eth");
      setIsLoggedIn(true);
      setStatus("connected");
      window.localStorage.setItem("jpg_fm_session", JSON.stringify(session));
      return token;
    } catch (err) {
      console.error(err);
      return null;
    }
  };

  const logout = () => {
    localStorage.removeItem("jpg_fm_session");
    disconnect();
    disconnectSolana();
    setToken(null);
    setProvider(null);
    setIsLoggedIn(false);
    setStatus("disconnected");
  };

  return { isLoggedIn, token, provider, status, loginETH, loginSolana, logout };
};

export default useAuth;
