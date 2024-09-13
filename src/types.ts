export interface User {
  userId: string;
  username: string;
  isAdmin: boolean;
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

export interface UpdatedUser {
  name: string;
  username: string;
  isAdmin: boolean;
  userId: string;
  password?: string | undefined;
}

export interface InUser {
  name: string;
  username: string;
  userId: string;
  isAdmin: boolean;
}

export interface InTask {
  _id: string;
  text: string;
  completed: boolean;
  userId: string;
  category: string;
}
export interface DictionaryItem {
  _id: string;
  commonality: number;
  text: string;
}
export type Task = {
  text: string;
  category?: string;
};
export interface OutTask {
  text: string;
  userId: string;
  category?: string;
}

export type Category = {
  _id: string;
  text: string;
  createdBy: string;
  added: Date | string;
};

export interface StandardCategory {
  _id: string;
  text: string;
}

export interface SingleActionType<T> {
  state: T;
  action: (e:T) => void;
}


export interface ModalActionType<T> {
  modalState: T;
  close: (e:T) => void;
}


export enum FormType {
  LOGIN = "login",
  SIGNUP = "signup",
}

export enum AccountType {
  ADMIN = "Admin",
  USER = "User",
}

export interface CategorySelectionProps {
  modalState: boolean;
  onHandleModalState: (e: boolean) => void;
}

export interface CategorySelectProps<J> extends SingleActionType<J> {
  
}

export interface UpdatedUserModalProps extends SingleActionType<boolean> {
  id: string;
}

export interface ConfirmModalProps extends ModalActionType<boolean> {
  action: () => {};
}