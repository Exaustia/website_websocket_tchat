import React, { useEffect, useRef, useState } from "react";
import useAuth from "../../hooks/useAuth";
import classNames from "classnames";
import { Link } from "react-router-dom";
import { useUser } from "../../context/UserProvider";
import { Moderate } from "./Moderate";
import { Message } from "../../types/Message";
import { getUserByUsername } from "../../API/user";
import { User } from "../../types/User";
import { toast } from "react-toastify";
import { UserProfil } from "../user";

interface ChatProps {
  messages: Message[];
  handleSend: CallableFunction;
}

const Chat = ({ handleSend, messages }: ChatProps) => {
  const { isLoggedIn } = useAuth();
  const { user } = useUser();
  const [message, setMessage] = useState<string>("");
  const [panelOpen, setPanelOpen] = useState<number | null>();
  const [panelUserOpen, setPanelUserOpen] = useState<number | null>();
  const [userToCheck, setUserToCheck] = useState<User>();
  const messagesContainerRef = useRef<HTMLDivElement>(null);

  const handleCallSend = () => {
    if (user?.isBanned) {
      toast.error("You are banned, you can't send message");
      return;
    }
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

  const handleOpenUserPanel = (username: string, index: number) => {
    getUserByUsername(username).then((res) => {
      if (res.error) {
        toast.error(res.error);
      }
      if (!res) {
        return;
      }
      setUserToCheck(res.data);
      setPanelUserOpen(index);
    });
    setPanelUserOpen(index);
  };

  const handleCloseUserPanel = () => {
    setPanelUserOpen(null);
    setPanelUserOpen(null);
  };

  return (
    <section className="h-full overflow-hidden lg:h-[calc(100vh-65px)] lg:max-w-[360px] min-w-[360px] flex flex-col border-l-[1px] border-[#29282E]">
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
                  "hover:bg-slate-600 rounded-lg": user?.isModerator,
                },
                "flex py-1 relative makeChildHover"
              )}
            >
              {user?.isModerator && (
                <button
                  onClick={() => (index === panelOpen ? setPanelOpen(null) : setPanelOpen(index))}
                  className="absolute right-0 top-0 hidden-child h-full bg-slate-50 flex justify-center items-center p-1 rounded-md"
                >
                  Manage
                </button>
              )}
              {user?.isModerator && index === panelOpen && (
                <div className="absolute z-50 top-10 -left-4 w-[calc(100%+2rem)]">
                  <Moderate message={message} handleClose={() => setPanelOpen(null)} />
                </div>
              )}
              {userToCheck && index === panelUserOpen && (
                <div className="absolute z-50 -left-4 w-[calc(100%+2rem)]">
                  <UserProfil user={userToCheck} handleClose={handleCloseUserPanel} />
                </div>
              )}
              <div className="leading-6 text-white ml-1 inline-block">
                {message.from === "user" && (
                  <>
                    <span
                      className={classNames(
                        `font-bold hover:bg-gray-200 hover:opacity-50 hover:rounded-md items-center cursor-pointer`
                      )}
                      style={{ color: message.usernameColor }}
                      onClick={() => handleOpenUserPanel(message.username, index)}
                    >
                      <img
                        src={`/images/chat/${message.provider === "eth" ? "eth" : "sol"}_ico.png`}
                        alt="verified"
                        className="w-5 h-5 inline-block mr-1 mb-1"
                      />
                      {message.username}
                    </span>

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
            disabled={!isLoggedIn || user?.isBanned}
            maxLength={256}
            placeholder={isLoggedIn ? "Type your message here" : "Login to chat"}
            className={classNames(
              {
                "cursor-not-allowed outline-none ": !isLoggedIn || user?.isBanned,
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
