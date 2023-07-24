import { useState, useEffect } from "react";
import { useUser } from "../../context/UserProvider";
import classNames from "classnames";
import fetchAPI from "../../utils/fetch";
import { toast } from "react-toastify";

const randomColor = ["#FC5151", "#F9A52B", "#F9D03E", "#A0D76F", "#4FC1E9", "#5D9CEC", "#AC92EC", "#EC87C0", "#CCD1D9"];

export const Profile = () => {
  const { user, refreshUser } = useUser();

  const [userColor, setUserColor] = useState<string>(user?.color || "");
  const [username, setUsername] = useState<string>(user?.username || "");
  const [description, setDescription] = useState<string>(user?.description || "");

  useEffect(() => {
    setUserColor(user?.color || "");
    setUsername(user?.username || "");
    setDescription(user?.description || "");
  }, [user]);

  const handleUpdateUser = () => {
    updateUser(username, userColor, description).then((res) => {
      if (res.success && refreshUser) {
        toast.success("User updated");
        refreshUser();
      } else {
        toast.error(res.error);
      }
    });
  };

  const handleDiscordLink = () => {
    console.log(user);
    if (!user || !user.id) return;
    if (process.env.NODE_ENV === "production") {
      window.open(
        `https://discord.com/api/oauth2/authorize?client_id=1133022626831417395&redirect_uri=https%3A%2F%2Fzemsurcp76.us-east-1.awsapprunner.com%2Fcallback%2Fdiscord&response_type=code&scope=identify&state=${user?.id}`
      );
    }
    window.open(
      `https://discord.com/api/oauth2/authorize?client_id=1133022626831417395&redirect_uri=http%3A%2F%2Flocalhost%3A8080%2Fcallback%2Fdiscord&response_type=code&scope=identify&state=${user?.id}`
    );
  };

  const handleTwitterLink = () => {
    fetchAPI("/callback/twitterURL", { method: "GET" }).then((res) => {
      if (res.error) {
        toast.error(res.error);
      } else {
        window.open(res.url, "_blank");
      }
    });
  };

  return (
    <div className="md:px-24 py-8  flex justify-center text-white ">
      <div className="border border-secondary-color rounded-md w-[95vw] md:w-[80vw] bg-[#18181b] flex flex-col">
        <div className="flex w-full border-b  border-secondary-color p-8">
          <label className="w-1/4">My name</label>
          <input
            className="border border-secondary-color rounded-md  bg-gray-950 py-1 ml-4 px-2 w-full h-fit"
            type="text"
            placeholder={user?.username}
            onChange={(e) => setUsername(e.target.value)}
            value={username}
          />
        </div>
        <div className="flex w-full border-b  border-secondary-color p-8">
          <label className="w-1/4">My description</label>
          <textarea
            className="border border-secondary-color rounded-md  bg-gray-950 py-1 ml-4 px-2 w-full h-fit"
            onChange={(e) => setDescription(e.target.value)}
            value={description}
          />
        </div>
        <div className="flex w-full border-b  border-secondary-color p-8">
          <label className="w-1/4">My socials</label>
          <div className="flex space-x-3">
            <div className="flex flex-col justify-between  items-center">
              <span className="font-bold text-lg">Discord</span>
              {user?.discordName && <span className="">#{user?.discordName}</span>}
              <button
                className="bg-[#547F84] rounded-[4px] flex justify-center items-center px-5 py-1 mt-2 ml-auto font-bold"
                onClick={handleDiscordLink}
              >
                {user?.discordName ? "Update Discord" : "Link Discord"}
              </button>
            </div>
            <div className="flex flex-col justify-between items-center">
              <span className="font-bold text-lg">Twitter</span>
              {user?.twitterName && <a href={"https://x.com/" + user.twitterName}>{user?.twitterName}</a>}
              <button
                className="bg-[#547F84] rounded-[4px] flex justify-center items-center px-5 py-1 mt-2 ml-auto font-bold"
                onClick={handleTwitterLink}
              >
                {user?.twitterName ? "Update Twitter" : "Link Twitter"}
              </button>
            </div>
          </div>
        </div>

        <div className="flex w-full mt-8 p-8 border-b  border-secondary-color ">
          <label className="w-1/4">My color</label>
          <div className="w-full flex flex-wrap">
            {randomColor.map((color) => {
              return (
                <div
                  onClick={() => setUserColor(color)}
                  key={color}
                  className={classNames(
                    {
                      "border-4 border-white": userColor === color,
                    },
                    "h-14 w-14 rounded-full cursor-pointer m-1"
                  )}
                  style={{ backgroundColor: color }}
                ></div>
              );
            })}
          </div>
        </div>
        <div className="flex justify-end w-full mt-8 p-4">
          <button
            className={classNames("bg-[#547F84] rounded-[4px] flex justify-center items-center px-5 py-1 mt-2 ml-auto")}
            onClick={() => handleUpdateUser()}
            tabIndex={0}
          >
            <span className="text-white font-bold">Confirm</span>
          </button>
        </div>
      </div>
    </div>
  );
};

const updateUser = async (username: string, color: string, description: string) => {
  const data = await fetchAPI("/user/update", {
    method: "PUT",
    body: {
      username,
      description,
      color,
    },
  });

  if (data.error) {
    return {
      error: (data.error as string) || "An error occured",
      success: false,
    };
  }
  return {
    error: null,
    success: true,
  };
};
