export type User = {
  id: string;
  username: string;
  solanaWallet: string | null;
  ethWallet: string | null;
  picture: string | null;
  createdAt: Date;
  updatedAt: Date;
  color: string;
};
