import React, { useState, useEffect } from "react";
import { User } from "../../types/User";

export const UserProfil = ({ user, handleClose }: { user: User; handleClose: () => void }) => {
  return (
    <div className="flex bg-black rounded-md p-2 relative">
      <button
        type="button"
        onClick={handleClose}
        className="absolute right-2 top-2 text-white bg-transparent hover:bg-gray-900 rounded-lg text-sm w-8 h-8 ml-auto inline-flex justify-center items-center "
        data-modal-hide="defaultModal"
      >
        <svg className="w-3 h-3" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 14 14">
          <path
            stroke="currentColor"
            stroke-linecap="round"
            stroke-linejoin="round"
            stroke-width="2"
            d="m1 1 6 6m0 0 6 6M7 7l6-6M7 7l-6 6"
          />
        </svg>
        <span className="sr-only">Close modal</span>
      </button>

      <div className="flex flex-col text-white">
        <div className="flex">
          <img
            src={user?.picture || "https://i.imgur.com/0LKZQYM.png"}
            alt="profile"
            className=" h-20 w-20 rounded-full"
          />
          <div className="ml-4">
            <h1 className="text-2xl font-bold mt-1">{user?.username}</h1>
            <div className="mt-1">
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
        {user.description && <div className="flex mt-4">{user.description}</div>}
      </div>
    </div>
  );
};
