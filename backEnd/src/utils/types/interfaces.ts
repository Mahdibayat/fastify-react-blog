export type IUserRoles = "admin" | "author";

export type IUser = {
  id: number;
  name: string;
  surname: string;
  mobile: string;
  role: IUserRoles;
};
