export interface IUserItem {
    id: number;
    email: string;
    fullName: string;
    image: string|null;
    roles: string[];
}

export interface IUserRowProps {
    user: IUserItem;
    initials: (name: string) => string;
}
