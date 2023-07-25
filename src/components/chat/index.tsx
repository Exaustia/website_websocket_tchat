import React, { useEffect, useRef, useState } from "react";
import useAuth from "../../hooks/useAuth";
import classNames from "classnames";
import { Link } from "react-router-dom";
import { useUser } from "../../context/UserProvider";
import { Moderate } from "./Moderate";
import { Message } from "../../types/Message";

interface ChatProps {
  messages: Message[];
  handleSend: CallableFunction;
}

const Chat = ({ handleSend, messages }: ChatProps) => {
  const { isLoggedIn } = useAuth();
  const { user } = useUser();
  const [message, setMessage] = useState<string>("");
  const [panelOpen, setPanelOpen] = useState<number | null>();
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
      <div className="text-sm overflow-x-auto h-full px-4 py-2" ref={messagesContainerRef}>
        {messages.map((message, index) => {
          return (
            <div
              key={index}
              className={classNames(
                {
                  "hover:bg-slate-100": user?.isModerator,
                },
                "flex py-1 relative"
              )}
              onClick={() => (index === panelOpen ? setPanelOpen(null) : setPanelOpen(index))}
            >
              {user?.isModerator && index === panelOpen && (
                <div className="absolute z-50 right-0">
                  <Moderate messageId={message.id} />
                </div>
              )}
              <div className="leading-6 text-white ml-1 inline-block">
                {message.from === "user" && (
                  <>
                    <Link
                      to={"/user/" + message.username}
                      className={classNames(
                        `font-bold hover:bg-gray-200 hover:opacity-50 hover:rounded-md items-center`
                      )}
                      style={{ color: message.usernameColor }}
                    >
                      <img
                        src={`/images/chat/${message.provider === "eth" ? "eth" : "sol"}_ico.png`}
                        alt="verified"
                        className="w-5 h-5 inline-block mr-1 mb-1"
                      />
                      {message.username}
                    </Link>

                    <span aria-hidden="true">: </span>
                  </>
                )}
                <span
                  className={classNames({ italic: message.from === "bot" || message.isModerated }, "text_chat")}
                  dangerouslySetInnerHTML={{ __html: urlify(message.content) }}
                ></span>
              </div>
            </div>
          );
        })}
      </div>
      <div className="w-full flex-1 min-h-[121px] px-4">
        <div
          className={classNames(
            {
              "cursor-not-allowed outline-none focus:outline-none focus:border-none ": !isLoggedIn,
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
            placeholder={isLoggedIn ? "Type your message here" : "Login to chat"}
            className={classNames(
              {
                "cursor-not-allowed outline-none ": !isLoggedIn,
              },
              "w-[90%] h-7  bg-primary-color focus:outline-none focus:border-none"
            )}
          />
          <img src="/images/send.svg" alt="send" className="w-5 h-5" onClick={() => isLoggedIn && handleCallSend()} />
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
  // or alternatively
  return text.replace(urlRegex, function (url: string) {
    return '<a class="mr-1 text-blue-700 italic word-break-all" href="' + url + '">' + url + "</a>";
  });

  // return text.replace(
  //   urlRegex,
  //   '<a style={{color: "#F0F0F0}} href="$1">$1</a>'
  // );
}
