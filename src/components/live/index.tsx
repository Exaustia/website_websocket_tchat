"use client";
import { useLoaderData } from "react-router-dom";
import Chat from "../chat";
import { useEffect, useRef, useState } from "react";
import useAuth from "../../hooks/useAuth";
import { useAuthContext } from "../../context/AuthProvider";
import jwtDecode from "jwt-decode";
import { useUser } from "../../context/UserProvider";
import fetchAPI from "../../utils/fetch";

interface LiveProps {
  streamId: string;
}

type Message = {
  username: string;
  content: string;
  from: "server" | "user" | "bot";
  provider: "eth" | "solana";
  isSub: boolean;
  usernameColor: string;
};

const Live = ({ streamId }: LiveProps) => {
  const { isLoggedIn, token } = useAuthContext();
  const { user } = useUser();
  const [username, setUsername] = useState<string>("Guest");
  const [messages, setMessages] = useState<Message[]>([]);
  const [connected, setConnected] = useState<boolean>(false);

  const webSocketRef = useRef<WebSocket | null>(null);

  useEffect(() => {
    if (token) {
      const jwtDecoded = jwtDecode(token || "") as { username: string };
      console.log("jwtDecoded", jwtDecoded);
      setUsername(jwtDecoded.username);
    }
  }, [token]);

  useEffect(() => {
    getTheLastMessageFromTheApi({ roomId: streamId }).then((res) => {
      setMessages((prevMessages) => [...prevMessages, ...res]);
    });
  }, [streamId]);

  useEffect(() => {
    webSocketRef.current = new WebSocket(
      "wss://7b71b72exg.execute-api.us-east-1.amazonaws.com/dev"
    );

    if (webSocketRef.current) {
      webSocketRef.current.onopen = (currentWS) => {
        if (webSocketRef.current) {
          webSocketRef.current.send(
            JSON.stringify({
              action: "enterRoom",
              roomId: "e7a997dc-edd6-11ed-a05b-0242ac120003",
              token: token,
            })
          );
        }
        setConnected(true);
      };
    }

    webSocketRef.current.onmessage = (event) => {
      const { data } = event;

      const {
        action,
        message,
        from,
        username,
        isSub,
        provider,
        usernameColor,
      } = data
        ? JSON.parse(data)
        : {
            action: "",
            message: "",
            from: "",
            username: "",
            isSub: false,
            provider: "",
            usernameColor: "",
          };

      switch (action) {
        case MESSAGE_ACTIONS.PUBLIC:
          const entry: Message = {
            username,
            content: message,
            from,
            provider,
            isSub,
            usernameColor,
          };
          setMessages((prevMessages) => [...prevMessages, entry]);
          break;

        default:
          break;
      }
    };

    const MESSAGE_ACTIONS = {
      PUBLIC: "publicMessage",
    };

    webSocketRef.current.onclose = () => {
      setConnected(false);
    };

    return () => {
      webSocketRef.current?.close();
    };
  }, [isLoggedIn, token]);

  const handleSend = (message: string) => {
    if (webSocketRef.current) {
      webSocketRef.current.send(
        JSON.stringify({
          action: "sendMessage",
          roomId: "e7a997dc-edd6-11ed-a05b-0242ac120003",
          message: message,
        })
      );
      setMessages((prevMessages) => [
        ...prevMessages,
        {
          username: user?.username || "Guest",
          content: message,
          from: "user",
          provider: "eth",
          isSub: false,
          usernameColor: user?.color || "#FF0000",
        },
      ]);
    }
  };

  return (
    <div className="flex w-full h-full">
      <div className="w-14  border-b-[1px] border-r-[1px] border-[#29282E]">
        toto
      </div>
      <div className="w-full">
        <iframe
          src={`https://player.twitch.tv/?channel=scoksc2&parent=${window.location.hostname}`}
          allowFullScreen={true}
          title="scoksc2"
          className="w-full h-[40vw] max-h-[920px]"
        />
      </div>
      <Chat handleSend={handleSend} messages={messages} />
    </div>
  );
};

export default Live;

const getTheLastMessageFromTheApi = async ({ roomId }: { roomId: string }) => {
  return fetchAPI(`/room/${roomId}/lastMessages`);
};
