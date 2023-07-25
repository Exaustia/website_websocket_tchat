import Chat from "../chat";
import { useEffect, useRef, useState, useCallback } from "react";

import { useAuthContext } from "../../context/AuthProvider";
import { useUser } from "../../context/UserProvider";
import fetchAPI from "../../utils/fetch";
import { Room } from "../../types/Room";
import { NotFound } from "../common/NotFound";
import { toast } from "react-toastify";
import { Message } from "../../types/Message";

interface LiveProps {
  streamId: string;
}

const MESSAGE_ACTIONS = {
  PUBLIC: "publicMessage",
  REMOVE: "removeMessage",
};

const Live = ({ streamId }: LiveProps) => {
  const { isLoggedIn, token } = useAuthContext();
  const [messages, setMessages] = useState<Message[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [connected, setConnected] = useState(false);
  const [roomData, setRoomData] = useState<Room>();

  const webSocketRef = useRef<WebSocket | null>(null);

  useEffect(() => {
    getRoomData(streamId).then((res) => {
      if (res.error) {
        setError("res.error");
      }
      if (!res.room) {
        setError("res.error");
        return;
      }
      setRoomData(res.room);
      getTheLastMessageFromTheApi({ roomId: res.room.id }).then((res) => {
        setMessages((prevMessages) => [...prevMessages, ...res]);
      });
    });
  }, [streamId]);

  const editMessage = useCallback(
    (id: string, newContent: string) => {
      if (messages.length === 0) {
        return;
      }

      const newMessages = messages.map((message) => {
        if (message.id === id) {
          return {
            ...message,
            content: newContent,
            isModerated: true,
          };
        }
        return {
          ...message,
          content: message.isModerated ? newContent : message.content,
        };
      });

      setMessages(newMessages);
    },
    [messages]
  );

  useEffect(() => {
    if (!webSocketRef.current) return;
    webSocketRef.current.onmessage = (event) => {
      const { data } = event;

      const { action, message, from, username, isSub, provider, usernameColor, id, isModerated } = data
        ? JSON.parse(data)
        : {
            action: "",
            message: "",
            from: "",
            username: "",
            isModerated: false,
            isSub: false,
            provider: "",
            usernameColor: "",
            id: "",
          };

      switch (action) {
        case MESSAGE_ACTIONS.PUBLIC:
          console.log("public");
          const entry: Message = {
            id,
            username,
            content: message,
            from,
            provider,
            isSub,
            isModerated,
            usernameColor,
          };
          setMessages((prevMessages) => [...prevMessages, entry]);
          break;
        case MESSAGE_ACTIONS.REMOVE:
          console.log("Remove");
          editMessage(id, "Message supprimé par un modérateur");
          break;
        default:
          break;
      }
    };
  }, [editMessage, messages]);

  const keepAlive = useCallback(() => {
    if (!webSocketRef.current) return;
    console.log("keep alive");
    webSocketRef.current.send(
      JSON.stringify({
        action: "keepAlive",
      })
    );
  }, []);

  useEffect(() => {
    const sendHeartbeat = () => {
      if (webSocketRef.current && webSocketRef.current.readyState === WebSocket.OPEN) {
        console.log("heartbeat")
        webSocketRef.current.send("heartbeat");
      }
    };

    const heartbeatInterval = setInterval(sendHeartbeat, 5000);

    return () => {
      clearInterval(heartbeatInterval);
    };
  }, []);

  useEffect(() => {
    if (!roomData || connected) return;
    webSocketRef.current = new WebSocket("wss://7b71b72exg.execute-api.us-east-1.amazonaws.com/dev");
    webSocketRef.current.onopen = () => {
      if (webSocketRef.current) {
        setConnected(true);
        webSocketRef.current.send(
          JSON.stringify({
            action: "enterRoom",
            roomId: roomData?.id,
            token: token,
          })
        );

        webSocketRef.current.onclose = () => {
          toast.error("La connexion au chat a été perdue, nous essayons de la rétablir");
          console.log("try to reconnect");
          if (webSocketRef.current?.CLOSED) {
            setTimeout(() => {
              webSocketRef.current = new WebSocket("wss://7b71b72exg.execute-api.us-east-1.amazonaws.com/dev");
              webSocketRef.current.send(
                JSON.stringify({
                  action: "enterRoom",
                  roomId: roomData?.id,
                  token: token,
                })
              );
            }, 5000);
          }
        };
      }
    };
  }, [isLoggedIn, token, roomData, connected]);

  const handleSend = (message: string) => {
    if (webSocketRef.current) {
      webSocketRef.current.send(
        JSON.stringify({
          action: "sendMessage",
          roomId: roomData?.id,
          message: message,
        })
      );
      // setMessages((prevMessages) => [
      //   ...prevMessages,
      //   {
      //     username: user?.username || "Guest",
      //     content: message,
      //     from: "user",
      //     provider: "eth",
      //     isSub: false,
      //     id: "",
      //     usernameColor: user?.color || "#FF0000",
      //   },
      // ]);
    }
  };
  if (error) return <NotFound />;

  return (
    <div className="flex w-full h-full">
      <div className="w-14  border-b-[1px] border-r-[1px] border-[#29282E]"></div>
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

const getRoomData = async (name: string) => {
  return fetchAPI(`/room/${name}`);
};
