import { ConnectButton } from "@rainbow-me/rainbowkit";
import { useAccount } from "wagmi";
import { useEffect, useState } from "react";
import { useAuthContext } from "../../context/AuthProvider";
import { WalletMultiButton } from "@solana/wallet-adapter-react-ui";
import { useWallet } from "@solana/wallet-adapter-react";

export const Login = () => {
  const {
    isLoggedIn,
    loginETH,
    loginSolana,
    status: authStatus,
    logout,
  } = useAuthContext();
  const { isConnected, isDisconnected, address, status } = useAccount();
  const [isConnectToWallet, setIsConnectToWallet] = useState<boolean>(false); // [TODO
  const walletSolana = useWallet();

  const [userCancelled, setUserCancelled] = useState<boolean>(false);

  const handleDisconnect = () => {
    setUserCancelled(true);
    setIsConnectToWallet(false);
    logout();
  };

  useEffect(() => {
    if ((isConnected || walletSolana.connected) && isLoggedIn) {
      setIsConnectToWallet(true);
    }
  }, [isConnected, isDisconnected, walletSolana.connected, isLoggedIn]);

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
      loginETH(address).catch(() => {
        setUserCancelled(true);
      });
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

  useEffect(() => {
    if (walletSolana.connected && !isLoggedIn && walletSolana.publicKey) {
      loginSolana(walletSolana.publicKey);
    }
  }, [walletSolana, isLoggedIn, loginSolana]);

  return (
    <div className="p-8 text-white flex justify-center items-center h-[calc(100vh-80px)] space-x-4">
      {!isConnectToWallet && (
        <>
          <div className="flex flex-col border border-secondary-color rounded-md bg-slate-600 w-fit p-5 justify-center items-center h-32">
            <span className="mb-4">Using Eth ?</span>
            <ConnectButton /> 
          </div>
          <div className="flex flex-col border border-secondary-color rounded-md bg-slate-600 w-fit p-5 justify-center items-center h-32">
            <span className="mb-4">Using Solana ?</span>
            <WalletMultiButton />
          </div>
        </>
      )}
      <div className="flex flex-col border border-secondary-color rounded-md bg-slate-600 w-fit p-5 justify-center items-center h-32">
        <span className="mb-4">Use me for logout</span>
        <button
          onClick={() => handleDisconnect()}
          className="text-white mt-4 px-4 py-2 bg-slate-500 rounded-sm"
        >
          Logout
        </button>
      </div>
    </div>
  );
};
