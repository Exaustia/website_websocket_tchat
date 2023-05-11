import { useState } from "react";
import { useUser } from "../../context/UserProvider";
import classNames from "classnames";
import fetchAPI from "../../utils/fetch";

const randomColor = [
  "#FC5151",
  "#F9A52B",
  "#F9D03E",
  "#A0D76F",
  "#4FC1E9",
  "#5D9CEC",
  "#AC92EC",
  "#EC87C0",
  "#CCD1D9",
];

export const Profile = () => {
  const { user, refreshUser } = useUser();

  const [userColor, setUserColor] = useState<string>(user?.color || "");
  const [username, setUsername] = useState<string>(user?.username || "");

  const handleUpdateUser = () => {
    updateUser(username, userColor).then((res) => {
      if (res && refreshUser) {
        refreshUser();
      }
    });
  };

  return (
    <div className="px-24 py-8 flex justify-center text-white ">
      <div className="border border-secondary-color rounded-md w-[80vw] bg-[#18181b] flex flex-col">
        <div className="flex w-full border-b  border-secondary-color p-8">
          <label className="w-1/4">Username</label>
          <input
            className="border border-secondary-color rounded-md  bg-gray-950 py-1 ml-4 px-2 w-full h-fit"
            type="text"
            onChange={(e) => setUsername(e.target.value)}
            value={username}
          />
        </div>
        <div className="flex w-full mt-8 p-8 ">
          <label className="w-1/4">username color</label>
          <div className="w-full flex space-x-2 flex-wrap">
            {randomColor.map((color) => {
              return (
                <div
                  onClick={() => setUserColor(color)}
                  key={color}
                  className={classNames(
                    {
                      "border-2 border-white": userColor === color,
                    },
                    "h-14 w-14 rounded-full cursor-pointer"
                  )}
                  style={{ backgroundColor: color }}
                ></div>
              );
            })}
          </div>
        </div>
        <div className="flex justify-end w-full mt-8 p-4">
          <button
            className="bg-[#FC5151] rounded-[4px] flex justify-center items-center px-5 py-1 mt-2 ml-auto "
            onClick={() => handleUpdateUser()}
            tabIndex={0}
          >
            <span className="text-white">Valider les changements</span>
          </button>
        </div>
      </div>
    </div>
  );
};

const updateUser = async (username: string, color: string) => {
  const data = await fetchAPI("/user/update", {
    method: "PUT",
    body: {
      username,
      color,
    },
  });

  if (data.error) {
    console.log(data.error);
    return false;
  }
  return true;
};
