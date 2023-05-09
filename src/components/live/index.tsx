"use client";
import { useLoaderData } from "react-router-dom";
import Chat from "../chat";
import { useEffect, useRef, useState } from "react";
import useAuth from "../../hooks/useAuth";

interface LiveProps {
  streamId: string;
}

type Message = {
  username: string;
  content: string;
};

const Live = ({ streamId }: LiveProps) => {
  const { isLoggedIn, token } = useAuth();
  const [messages, setMessages] = useState<Message[]>([]);
  const [connected, setConnected] = useState<boolean>(false);

  const webSocketRef = useRef<WebSocket | null>(null);

  useEffect(() => {
    webSocketRef.current = new WebSocket(
      "wss://7b71b72exg.execute-api.us-east-1.amazonaws.com/dev"
    );

    if (webSocketRef.current) {
      webSocketRef.current.onopen = (currentWS) => {
        if (webSocketRef.current) {
          if (isLoggedIn && token)
            webSocketRef.current.send(
              JSON.stringify({
                action: "authenticate",
                token: token,
              })
            );

          webSocketRef.current.send(
            JSON.stringify({
              action: "enterRoom",
              roomId: "e7a997dc-edd6-11ed-a05b-0242ac120003",
            })
          );
        }

        setConnected(true);
      };
    }

    webSocketRef.current.onmessage = (event) => {
      const { data } = event;

      const { action, message } = data
        ? JSON.parse(data)
        : { action: "", message: "" };

      switch (action) {
        case MESSAGE_ACTIONS.PUBLIC:
          const entry = {
            username: "anymous",
            content: message,
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
  }, []);

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
        { username: "me", content: message },
      ]);
    }
  };
console.log(window.location.hostname)
  return (
    <div className="flex w-full h-full">
      <div className="w-80">
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
