export interface IFriend{
    id: string
    name: string;
    image: string;
}

export interface IUser extends IFriend{
    email: string;
}
