import React, { useState, useEffect } from "react";
import { User } from "../../types/User";
import fetchAPI from "../../utils/fetch";

interface UserProps {
  username: string;
}

export const UserProfil = ({ username }: UserProps) => {
  const [user, setUser] = useState<User>();

  useEffect(() => {
    getUserByUsername(username).then((res) => {
      if (!res.error) {
        setUser(res.data);
      }
    });
  }, [username]);
  return (
    <div className="flex justify-center items-center mt-8">
      <div className="flex flex-col items-center border-2 border-red-50 rounded-lg p-8 text-white">
        <div className="flex flex-col items-center">
          <img
            src={user?.picture || "https://i.imgur.com/0LKZQYM.png"}
            alt="profile"
            className="w-32 h-32 rounded-full"
          />
          <h1 className="text-2xl font-bold mt-4">{user?.username}</h1>
          <p className="text-lg mt-2">{user?.description}</p>
          <div className="mt-4">
            <span>Socials</span>
            <div className="flex flex-row mt-2">
              Twitter:
              <a href={"https://x.com/" + user?.twitterName} className="text-blue-500 ml-2">
                {user?.twitterName}
              </a>
            </div>
            <div className="flex flex-row mt-2">Discord: {user?.discordName}</div>
          </div>
        </div>
      </div>
    </div>
  );
};

const getUserByUsername = async (username: string) => {
  return fetchAPI(`/user/profile/${username}`, { method: "GET" }).then((res) => {
    if (!res.error) {
      return {
        error: false,
        data: res,
      };
    }
    return {
      error: true,
      data: null,
    };
  });
};
