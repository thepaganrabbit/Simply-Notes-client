import { BehaviorSubject } from "rxjs";
import { OutUser, User } from "../types";
import axios, { AxiosError } from "axios";
import toast from "react-hot-toast";

const SERVER_URL = "http://www.local-server.com:3000";

const UserObs = new BehaviorSubject<User | null>(null);

export const signUp = async (user: OutUser): Promise<boolean> => {
  try {
    const { data } = await axios.post(SERVER_URL + "/auth/sign-up", user);
    if (!data.success) {
      throw new Error(data.message);
    }
    window.sessionStorage.setItem("notes_sesion", JSON.stringify(data.payload));
    UserObs.next(data.payload);
    toast.success("Successful sign in");
    return true;
  } catch (error) {
    toast.error(
      `${(error as AxiosError).request.statusText}: ${
        (error as any).response?.data.code
      }`
    );
    return false;
  }
};

export const checkToken = () => {
  let token = null;
  UserObs.asObservable().subscribe((value) => {
    if (value?.token) {
      token = value.token;
    }
    token = null;
  });

  token = window!.sessionStorage.getItem("notes_sesion");
  if (!token) {
    return false;
  }
  const user = JSON.parse(token) as User;
  UserObs.next(user);
  return user.token;
};

export const verifyToken = async (token: string) => {
  try {
    const { data } = await axios.get(SERVER_URL + "/auth/verify", {
      headers: {
        Authorization: `bearer ${token}`,
      },
    });
    return data.payload as boolean;
  } catch (error) {
    toast.error(
      `${(error as AxiosError).request.statusText}: ${
        (error as any).response?.data.code
      }`
    );
  }
};

export const loginUser = async (user: OutUser): Promise<boolean> => {
  try {
    const { data } = await axios.post(SERVER_URL + "/auth/login", user);
    if (!data.success) {
      throw new Error(data.message);
    }
    window.sessionStorage.setItem("notes_sesion", JSON.stringify(data.payload));
    UserObs.next(data.payload); 
    return true;
  } catch (error) {
    toast.error(
      `${(error as AxiosError).request.statusText}: ${
        (error as any).response?.data.code
      }`
    );
    return false;
  } 
};

export const loginUserOut = (): boolean => {
    const token = checkToken();
    if(!token) {
      toast.error('no such session found.')
      return false;
    }
    window.sessionStorage.removeItem('notes_sesion');
    return true;
};
export default UserObs;
