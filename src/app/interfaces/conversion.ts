import { IUser } from "./user";

export interface IConversion {
  id: string;
  is_group: boolean;
  members: IUser[];
  profile?: string;
  createdAt: string;
  title: string;
  unseenCount: number;
}
