import fetchAPI from "../utils/fetch";

export const getUserByUsername = async (username: string) => {
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
