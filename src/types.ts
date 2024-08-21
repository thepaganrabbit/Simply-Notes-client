export interface User {
    userId: string;
    username: string;
    name: string;
    token: string;
}

export interface OutUser {
    name?: string;
    username: string;
    password: string;
}