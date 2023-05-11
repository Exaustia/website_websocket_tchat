import React, { useEffect, useRef, useState } from "react";
import useAuth from "../../hooks/useAuth";
import classNames from "classnames";
import { Link } from "react-router-dom";

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
  const messagesContainerRef = useRef<HTMLDivElement>(null);

  const handleCallSend = () => {
    if (message === "") return;
    handleSend(message);
    setMessage("");
  };

  useEffect(() => {
    // Faire défiler vers le bas au chargement initial
    scrollDown();

    if (messages.length > 0) {
      console.log("ici");
      scrollToBottom();
    }
  }, [messages]);

  const scrollDown = () => {
    if (messagesContainerRef.current) {
      messagesContainerRef.current.scrollIntoView({
        behavior: "smooth",
        block: "end",
      });
    }
  };

  const scrollToBottom = () => {
    if (messagesContainerRef.current) {
      messagesContainerRef.current.scrollTo(0, 9999999);
    }
  };

  return (
    <section className="h-[calc(100vh-65px)] w-[27rem] flex flex-col border-l-[1px] border-[#29282E]">
      <div className="flex justify-center items-center py-4 border-b-[1px] border-[#29282E]">
        <h1 className="text-white text-lg font-bold">Stream chat</h1>
      </div>
      <div
        className="text-sm overflow-x-auto h-full px-4 py-2"
        ref={messagesContainerRef}
      >
        {messages.map((message, index) => {
          const color = message.usernameColor;
          return (
            <div key={index} className="flex">
              <Link
                to={"/profile/" + message.username}
                className={classNames(`font-bold `)}
                style={{ color }}
              >
                {message.username}:
              </Link>
              <span
                className="text-white ml-1 flex break-all"
                dangerouslySetInnerHTML={{ __html: urlify(message.content) }}
              ></span>
            </div>
          );
        })}
      </div>
      <div className="w-full flex-1 min-h-[121px] px-4">
        <div
          className={classNames(
            {
              "cursor-not-allowed outline-none focus:outline-none focus:border-none ":
                !isLoggedIn,
            },
            "w-full border border-[#29282E] bg-primary-color rounded-md  text-white px-4 py-2 text-sm flex justify-between items-center"
          )}
        >
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
            maxLength={256}
            placeholder={
              isLoggedIn ? "Type your message here" : "Login to chat"
            }
            className={classNames(
              {
                "cursor-not-allowed outline-none ": !isLoggedIn,
              },
              "w-[90%] h-7  bg-primary-color focus:outline-none focus:border-none"
            )}
          />
          <img
            src="/images/send.svg"
            alt="send"
            className="w-5 h-5"
            onClick={() => isLoggedIn && handleCallSend()}
          />
        </div>
        <button
          className="bg-[#FC5151] rounded-[4px] flex justify-center items-center px-5 py-1 mt-2 ml-auto "
          onClick={() => alert("tips")}
          tabIndex={0}
        >
          <span className="text-white">Tips</span>
        </button>
      </div>
    </section>
  );
};

export default Chat;

function urlify(text: string) {
  var urlRegex = /(https?:\/\/[^\s]+)/g;
  return text.replace(urlRegex, function (url: string) {
    return (
      '<a class="mr-1 text-blue-700 italic word-break-all" href="' +
      url +
      '">' +
      url +
      "</a>"
    );
  });
  // or alternatively
  // return text.replace(urlRegex, '<a href="$1">$1</a>')
}
