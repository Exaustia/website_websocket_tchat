export type User = {
  id: string;
  discordId: string | null;
  discordName: string | null;
  description: string | null;
  twitterId: string | null;
  twitterName: string | null;
  username: string;
  solanaWallet: string | null;
  ethWallet: string | null;
  picture: string | null;
  createdAt: Date;
  updatedAt: Date;
  color: string;
};
