import fetchAPI from "../../utils/fetch";

export const Moderate = ({ messageId }: { messageId: string }) => {
  const handleRemoveMessage = () => {
    removeMessage(messageId);
  };
  return (
    <div className="bg-gray-400 p-4 flex flex-col">
      <button
        className="bg-[#FC5151] rounded-[4px] flex justify-center items-center px-5 py-1"
        onClick={handleRemoveMessage}
        tabIndex={0}
      >
        <span className="text-white">Remove this message</span>
      </button>
    </div>
  );
};

const removeMessage = (messageId: string) => {
  console.log(messageId);
  return fetchAPI(`/chat/remove_message`, { method: "POST", body: { id: messageId } });
};
