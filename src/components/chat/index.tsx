import { useEffect, useRef, useState } from "react";
import useAuth from "../../hooks/useAuth";
import classNames from "classnames";

type Message = {
  username: string;
  content: string;
  from: "server" | "user" | "bot";
  provider: "eth" | "solana";
  isSub: boolean;
  usernameColor: string;
};

interface ChatProps {
  messages: Message[];
  handleSend: CallableFunction;
}

const Chat = ({ handleSend, messages }: ChatProps) => {
  const { isLoggedIn } = useAuth();
  const [message, setMessage] = useState<string>("");

  const handleCallSend = () => {
    handleSend(message);
    setMessage("");
  };

  return (
    <section className="h-[calc(100vh-65px)] w-[27rem] flex flex-col border-l-[1px] border-[#29282E]">
      <div className="flex justify-center items-center py-4 border-b-[1px] border-[#29282E]">
        <h1 className="text-white text-lg font-bold">Stream chat</h1>
      </div>
      <div className="text-sm mt-2 overflow-x-auto h-full px-4">
        {messages.map((message, index) => {
          const color = message.usernameColor;
          return (
            <div key={index}>
              <span className={classNames(`font-bold `)} style={{ color }}>
                {message.username}:
              </span>
              <span className="text-white ml-1">{message.content}</span>
            </div>
          );
        })}
      </div>
      <div className="w-full flex-1 min-h-[121px] px-4">
        <input
          type="text"
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              e.preventDefault();
              handleCallSend();
            }
          }}
          onChange={(e) => isLoggedIn && setMessage(e.target.value)}
          value={message}
          disabled={!isLoggedIn}
          placeholder={isLoggedIn ? "Type your message here" : "Login to chat"}
          className={classNames(
            {
              "cursor-not-allowed outline-none focus:outline-none focus:border-none ":
                !isLoggedIn,
            },
            "w-full border border-[#29282E] bg-primary-color rounded-md  text-white px-2 py-3 text-sm"
          )}
        />
        <button
          className="bg-[#FC5151] rounded-[4px] flex justify-center items-center px-5 py-1 mt-2 ml-auto "
          onClick={() => isLoggedIn && handleCallSend()}
          tabIndex={0}
        >
          <span className="text-white">Tips</span>
        </button>
      </div>
    </section>
  );
};

export default Chat;
