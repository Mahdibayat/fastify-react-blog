export interface IUser {
  id: number;
  name: string;
  surname: string;
  mobile: string;
  password: string;
  created_at: Date;
  update_at: Date;
}

export function normalizeUser(
  user: IUser | null
): Omit<IUser, "password"> | null {
  if (!user) return null;
  const { password, ...safeUser } = user;
  return safeUser;
}
