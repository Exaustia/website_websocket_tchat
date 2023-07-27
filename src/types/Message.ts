export type Message = {
  username: string;
  content: string;
  from: "server" | "user" | "bot";
  provider: "eth" | "sol";
  isSub: boolean;
  usernameColor: string;
  id: string;
  isModerated: boolean;
  userId: string;
};
