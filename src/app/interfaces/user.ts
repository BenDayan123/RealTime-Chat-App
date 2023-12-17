export interface IFriend {
  id: string;
  name: string;
  image: string;
  status?: IStatus;
  friendship_status: FriendShipStatus;
  type: "outgoing" | "ingoing";
}

export interface IUser {
  id: string;
  name: string;
  image: string;
  status?: IStatus;
}

export type IStatus = "online" | "offline";

export type FriendShipStatus = "ACCEPTED" | "PENDING";
