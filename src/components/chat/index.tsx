import { useEffect, useRef, useState } from "react";
import useAuth from "../../hooks/useAuth";

type Message = {
  username: string;
  content: string;
};

interface ChatProps {
  messages: Message[];
  handleSend: CallableFunction;
}

const Chat = ({ handleSend, messages }: ChatProps) => {
  const [message, setMessage] = useState<string>("");

  const handleCallSend = () => {
    handleSend(message);
    setMessage("");
  };

  return (
    <section className="w-[27rem] bg-slate-950 flex flex-col px-4">
      <div className="md:h-[85%] h-[90%] text-white text-sm mt-2 overflow-x-auto">
        {messages.map((message, index) => {
          return (
            <div key={index}>
              <span className="font-bold">{message.username}:</span>
              <span className="text-white ml-1">{message.content}</span>
            </div>
          );
        })}
      </div>
      <div className="w-full flex-1 min-h-[121px]">
        <input
          type="text"
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              e.preventDefault();
              handleCallSend();
            }
          }}
          onChange={(e) => setMessage(e.target.value)}
          value={message}
          className="w-full bg-slate-950 border border-slate-800 rounded-md h-9 text-white px-1 text-sm"
        />
        <button
          className="bg-cyan-600 rounded-md flex justify-center items-center px-2 py-1 mt-2 ml-auto "
          onClick={() => handleCallSend()}
          tabIndex={0}
        >
          <span className="text-white">Chat</span>
        </button>
      </div>
    </section>
  );
};

export default Chat;
