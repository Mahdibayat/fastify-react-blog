import {
  ColumnType,
  Generated,
  Insertable,
  // JSONColumnType,
  Selectable,
  Updateable,
} from "kysely";
import { IUserRoles } from "../utils/types/interfaces.js";

export interface UserTable {
  id: Generated<number>;
  name: string;
  surname: string;
  mobile: string;
  password: string;
  role: IUserRoles;
  created_at: ColumnType<Date, string | undefined, never>;
  update_at: ColumnType<Date, string | undefined, never>;
}

export type User = Selectable<UserTable>;
export type NewUser = Insertable<UserTable>;
export type UserUpdate = Updateable<UserTable>;
