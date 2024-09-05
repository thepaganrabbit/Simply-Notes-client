export interface User {
  userId: string;
  username: string;
  name: string;
  token: string;
}

export interface CustomResponse<T> {
  payload: T;
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


export interface InUser {
  name: string;
  username: string;
  userId: string;
  isAdmin: boolean;
}

export interface Task {
  _id: string;
  text: string;
  completed: boolean;
  userId: string;
}
export interface DictionaryItem {
  _id: string;
  commonality: number;
  text: string;
}

export interface OutTask {
  text: string;
  userId: string;
}

export enum FormType {
  LOGIN = "login",
  SIGNUP = "signup",
}

export enum AccountType {
  ADMIN = "Admin",
  USER = "User",
}