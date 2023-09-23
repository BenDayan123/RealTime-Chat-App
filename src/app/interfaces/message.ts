import { IUser } from "./user";

export interface IMessage {
  body: string;
  chatID: string;
  createdAt: string;
  from: IUser;
  seen: boolean;
  fromID: string;
  id: string;
  updatedAt: string;
}
