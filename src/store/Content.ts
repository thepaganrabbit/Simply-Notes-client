import { BehaviorSubject } from "rxjs";
import axios, { AxiosError } from "axios";
import toast from "react-hot-toast";
import { CustomResponse, Task } from "../types";

const SERVER_URL = "http://www.local-server.com:3000";

export const WordDictObs = new BehaviorSubject<string[] | null>(null);

export const TasksObs = new BehaviorSubject<Task[] | null>(null);

export const getDict = async (token: string) => {
  console.log('called', token);
  try {
    const { data } = await axios.get<CustomResponse<string[]>>(SERVER_URL + "/content/dictionary", {
      headers: { Authorization: `Bearer ${token}` },
    });
    console.log(data);
    WordDictObs.next(data.payload)
    return true;
  } catch (error) {
    toast.error((error as AxiosError).message);
    return false
  }
};
