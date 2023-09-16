import { IUser } from "./user";

export interface IMessage {
  body: string;
  chatID: string;
  createdAt: Date | string;
  from: IUser;
  fromID: string;
  id: string;
  updatedAt: Date | string;
}
