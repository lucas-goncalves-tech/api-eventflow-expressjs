export type IUser = {
  id: string;
  email: string;
  name: string;
  password_hash: string;
  role: string;
  created_at: Date;
};

export type IUserInput = {
  email: string;
  name: string;
  password_hash: string;
};
