import React from "react";
import ReactDOM from "react-dom/client";

import "@rainbow-me/rainbowkit/styles.css";
import { darkTheme, getDefaultWallets, RainbowKitProvider } from "@rainbow-me/rainbowkit";
import { configureChains, createConfig, WagmiConfig } from "wagmi";
import { mainnet, polygon, optimism, arbitrum } from "wagmi/chains";

import { publicProvider } from "wagmi/providers/public";

import "./index.css";
import reportWebVitals from "./reportWebVitals";
import { RouterProvider, createBrowserRouter } from "react-router-dom";
import Home from "./routes/Home";
import LiveRoute from "./routes/live";
import ErrorPage from "./routes/errorPage";
import LoginRoute from "./routes/login";
import ProfileRoute from "./routes/profile";
import { AuthProvider } from "./context/AuthProvider";
import { UserProvider } from "./context/UserProvider";
import { WalletProviderCustom } from "./context/WalletProvider";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const router = createBrowserRouter([
  {
    path: "/",
    element: <Home />,
    errorElement: <ErrorPage />,
    children: [
      {
        path: ":streamId",
        element: <LiveRoute />,
      },
      {
        path: "login",
        element: <LoginRoute />,
      },
      {
        path: "profile",
        element: <ProfileRoute />,
      },
    ],
  },
]);

const { chains, publicClient, webSocketPublicClient } = configureChains(
  [mainnet, polygon, optimism, arbitrum, ...(process.env.REACT_APP_ENABLE_TESTNETS === "true" ? [mainnet] : [])],
  [publicProvider()]
);

const { connectors } = getDefaultWallets({
  appName: "RainbowKit demo",
  projectId: "9cf0ed08b0c0539f18bcaa9d286ef710",
  chains,
});

const wagmiConfig = createConfig({
  autoConnect: true,
  connectors,
  publicClient,
  webSocketPublicClient,
});

const root = ReactDOM.createRoot(document.getElementById("root") as HTMLElement);

root.render(
  <WalletProviderCustom>
    <WagmiConfig config={wagmiConfig}>
      <RainbowKitProvider chains={chains}>
        <AuthProvider>
          <UserProvider>
            <RouterProvider router={router} />{" "}
            <ToastContainer
              position="bottom-right"
              autoClose={5000}
              hideProgressBar={false}
              newestOnTop={false}
              closeOnClick
              rtl={false}
              pauseOnFocusLoss
              draggable
              pauseOnHover
              theme="dark"
            />
          </UserProvider>
        </AuthProvider>
      </RainbowKitProvider>
    </WagmiConfig>
  </WalletProviderCustom>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
