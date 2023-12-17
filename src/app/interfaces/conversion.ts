import { IUser } from "./user";

export interface IConversion {
  id: string;
  is_group: boolean;
  members: IUser[];
  admins: IUser[];
  description?: string;
  profile?: string;
  createdAt: string;
  name: string;
  unseenCount: number;
  lastAction: {
    body: string;
    createdAt: string;
  };
  liveAction?: {
    user: string;
    type: "TYPING" | "RECORDING";
  };
}
