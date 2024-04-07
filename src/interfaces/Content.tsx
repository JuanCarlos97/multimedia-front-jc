export interface Content {
    _id: string;
    type: string;
    url: string;
    text?: string;
    theme: Theme;
    user: User;
    credits: string;
    createdAt: Date;
    updatedAt: Date;
    __v: number;
}

export interface Theme {
    _id: string;
    name: string;
}

export interface User {
    _id: string;
    username: string;
    email: string;
    role: string;
    createdAt: Date;
    updatedAt: Date;
    __v: number;
}