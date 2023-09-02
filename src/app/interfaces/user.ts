export interface IFriend{
    id: string
    name: string;
    image: string;
    status?: IStatus
}

export interface IUser extends IFriend{
    email: string;
}

export type IStatus = "online" | "offline";