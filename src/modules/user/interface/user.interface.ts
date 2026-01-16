export type IUser = {
  id: string;
  email: string;
  name: string;
  password_hash: string;
  role: "USER" | "ORGANIZER" | "ADMIN";
  created_at: Date;
};

export type IUserInput = {
  email: string;
  name: string;
  password_hash: string;
};

export type IUserRepository = {
  findById: (id: string) =>  Promise<IUser | null>;
  findByEmail: (email: string) => Promise<IUser | null>;
  create: (data: IUserInput) => Promise<IUser | null>
}
