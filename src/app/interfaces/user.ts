export interface IFriend{
    id: string
    name: string;
    image: string;
    status?: "online" | "offline"
}

export interface IUser extends IFriend{
    email: string;
}
