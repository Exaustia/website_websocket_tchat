import fetchAPI from "../utils/fetch";

export const getUserConnected = async (roomId: string) => {
  return fetchAPI(`/chat/${roomId}/nbuser`, { method: "GET" }).then((res) => {
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
