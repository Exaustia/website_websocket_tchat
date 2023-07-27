import { Message } from "../../types/Message";
import fetchAPI from "../../utils/fetch";

export const Moderate = ({ message, handleClose }: { message: Message; handleClose: () => void }) => {
  const handleRemoveMessage = () => {
    removeMessage(message.id);
  };
  const handleBanUser = () => {
    banUser(message.id);
  };
  return (
    <div className="flex bg-black rounded-md p-2 m-2 relative flex-col">
      <h3 className="text-xl text-white font-bold">Moderator panel</h3>
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

      <div className="flex flex-col text-white mt-2 gap-2">
        <button className={"bg-slate-500 p-2 rounded-md"} onClick={handleRemoveMessage}>
          Delete message
        </button>
        <button className={"bg-slate-500 p-2 rounded-md"} onClick={handleBanUser}>
          Ban user
        </button>
      </div>
    </div>
  );
};

const removeMessage = (messageId: string) => {
  return fetchAPI(`/chat/remove_message`, { method: "POST", body: { id: messageId } });
};

const banUser = (messageId: string) => {
  console.log(messageId);
  return fetchAPI(`/chat/ban`, { method: "POST", body: { id: messageId } });
};
