import { BehaviorSubject } from "rxjs";
import { InUser, OutUser, User } from "../types";
import axios, { AxiosError } from "axios";
import toast from "react-hot-toast";

const SERVER_URL = "http://www.local-server.com:3000";

const UserObs = new BehaviorSubject<User | null>(null);
export const UsersObs = new BehaviorSubject<InUser[]>([]);


export const signUp = async (user: OutUser): Promise<boolean> => {
  try {
    const { data } = await axios.post(SERVER_URL + "/auth/sign-up", user);
    if (!data.success) {
      throw new Error(data.message);
    }
    window.sessionStorage.setItem(
      "notes_session",
      JSON.stringify(data.payload)
    );
    UserObs.next(data.payload);
    toast.success("Successful sign in");
    return true;
  } catch (error) {
    toast.error(
      `${(error as AxiosError).request.statusText}: ${
        (error as any).response?.data.code
      }`
    );
    return true;
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

  token = window!.sessionStorage.getItem("notes_session");
  if (!token) {
    return false;
  }
  const user = JSON.parse(token) as User;
  UserObs.next(user);
  return user.token;
};

export const verifyAdmin = async (
): Promise<boolean> => {
  try {
    const token = checkToken();
    if (!token) return false;
    const { data } = await axios.get(SERVER_URL + "/auth/is-admin", {
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
    return false;
  }
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
    return false;
  }
};

export const getUsersFromRemote = async () => {
  try {
    let token = checkToken();
    if(!token) throw new AxiosError("Token issues", '404')
    const { data, status } = await axios.get<{payload: InUser[]}>(SERVER_URL + "/user", {
      headers: {
        Authorization: `bearer ${token}`,
      },
    }); 
    console.log(data);
    if(status > 205) throw new AxiosError('failed to fuck off')
    UsersObs.next(data.payload)
    return 200;
  } catch (error) {
    console.log(error);
    return 500;
  }
};

export const loginUser = async (user: OutUser): Promise<boolean> => {
  try {
    const response = await axios.post(SERVER_URL + "/auth/login", user);
    const { data } = response;
    if (data.code > 240) {
      throw new AxiosError(data.message, data.code);
    }
    if (!data.success) {
      throw new Error(data.message);
    }
    window.sessionStorage.setItem(
      "notes_session",
      JSON.stringify(data.payload)
    );
    UserObs.next(data.payload);
    return true;
  } catch (error) {
    toast.error(
      `${(error as AxiosError).code}: ${(error as any).response?.data.code}`
    );
    return false;
  }
};

export const loginUserOut = (): boolean => {
  UserObs.next(null);
  const token = checkToken();
  if (!token) {
    toast.error("no such session found.");
    return false;
  }
  window.sessionStorage.removeItem("notes_session");
  return true;
};

export default UserObs;
