import { IUser } from "./user";

export type UserSeenType = Pick<IUser, "id" | "image" | "name">;
export interface IMessage {
  body: string;
  chatID: string;
  createdAt: string;
  from: IUser;
  voice?: IFile;
  seen: UserSeenType[];
  fromID: string;
  id: string;
  type: MessageType;
  updatedAt: string;
  files: IFile[];
}

export interface IFile {
  id: string;
  path: string;
  size: number;
  metadata: string;
  url: string;
  uploadedAt: Date;
  message?: IMessage;
}

export type MessageType =
  | "DELETED"
  | "MEDIA"
  | "FILE"
  | "AUDIO"
  | "TEXT"
  | "INFO";
