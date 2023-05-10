import { ConnectButton } from "@rainbow-me/rainbowkit";
import { WagmiConfig, useAccount, useDisconnect } from "wagmi";
import { useEffect, useState } from "react";
import { useAuthContext } from "../../context/AuthProvider";

export const Login = () => {
  const {
    isLoggedIn,
    token,
    loginETH,
    status: authStatus,
    logout,
  } = useAuthContext();
  const { isConnected, isDisconnected, address, status } = useAccount();

  const [ethSign, setEthSign] = useState<boolean>(false);
  const [userCancelled, setUserCancelled] = useState<boolean>(false);

  const handleDisconnect = () => {
    setUserCancelled(true);
    logout();
  };

  useEffect(() => {
    // reset userCancelled after 20sec
    const timeout = setTimeout(() => {
      setUserCancelled(false);
    }, 2000);
    return () => clearTimeout(timeout);
  }, [userCancelled]);

  useEffect(() => {
    if (
      isConnected &&
      !isLoggedIn &&
      status !== "reconnecting" &&
      authStatus === "disconnected" &&
      !userCancelled
    ) {
      setEthSign(true);
      loginETH(address)
        .catch(() => {
          setUserCancelled(true);
        })
        .finally(() => setEthSign(false));
    }
  }, [
    isConnected,
    isLoggedIn,
    status,
    authStatus,
    address,
    userCancelled,
    loginETH,
  ]);

  return (
    <div className="p-8">
      <ConnectButton />

      <button onClick={() => handleDisconnect()} className="text-white mt-4 px-4 py-2 bg-slate-500 rounded-sm">Logout</button>
    </div>
  );
};
