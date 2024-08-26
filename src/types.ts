export interface User {
    userId: string;
    username: string;
    name: string;
    token: string;
}

export interface CustomResponse <T> {
    payload: T,
    success: boolean;
    code: number;
    message?: string;
    error?: Error | any;
}

export interface OutUser {
    name?: string;
    username: string;
    password: string;
}

export interface Task {
    _id?: string;
    title: string;
    description: string;
    isDone: boolean;
}

