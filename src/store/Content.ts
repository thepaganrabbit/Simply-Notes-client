import { BehaviorSubject } from "rxjs";
import axios, { AxiosError } from "axios";
import toast from "react-hot-toast";                    
import { CustomResponse, DictionaryItem, Task, User } from "../types";

const SERVER_URL = "http://www.local-server.com:3000";

export const WordDictObs = new BehaviorSubject<DictionaryItem[] | null>(null);

export const TasksObs = new BehaviorSubject<Task[] | null>(null);

export const getDict = async (): Promise<number> => {
  const user = window.sessionStorage.getItem("notes_session");
    if (!user) {
      return 404;
    }
    const token = JSON.parse(user).token;
  try {
    const { data } = await axios.get<CustomResponse<DictionaryItem[]>>(
      SERVER_URL + "/content/dictionary",
      {
        headers: { Authorization: `Bearer ${token}` },
      }
    );
    WordDictObs.next(data.payload);
    return 200;
  } catch (error) {
    toast.error((error as AxiosError).message);
    return (error as AxiosError).response!.status || 500;
  }
};



export const getTasks = async (): Promise<number> => {
  try {
    const user = window.sessionStorage.getItem("notes_session");
    if (!user) {
      return 404;
    }
    const token = JSON.parse(user).token;
    const { data } = await axios.get<CustomResponse<Task[]>>(
      SERVER_URL + "/content/tasks",
      {
        headers: { Authorization: `Bearer ${token}` },
      }
    );
    TasksObs.next(data.payload);
    return 200;
  } catch (error) {
    toast.error((error as AxiosError).message);
    console.log('this is the status tasks ', (error as AxiosError));
    return (error as AxiosError).status || 500;
  }
};

export const addTask = async (text: string): Promise<number> => {
  try {
    const user = window.sessionStorage.getItem("notes_session");
    if (!user) {
      return 404;
    }
    const userObj = JSON.parse(user) as User;
    const {token, userId} = userObj;
    const task = {
      text,
      userId
    }
    const { data } = await axios.post<CustomResponse<Task[]>>(
      SERVER_URL + "/content/add-task",
      task,
      {
        headers: { Authorization: `Bearer ${token}` },
      }
    );
    await getDict()
    TasksObs.next(data.payload);
    return 200;
  } catch (error) {
    toast.error((error as AxiosError).message);
    return (error as AxiosError).response!.status || 500;
  }
};
export const completeTask = async (id: string): Promise<number> => {
  try {
    const user = window.sessionStorage.getItem("notes_session");
    if (!user) {
      return 404;
    }
    const userObj = JSON.parse(user) as User;
    const {token } = userObj;
    const { data } = await axios.patch<CustomResponse<Task[]>>(
      SERVER_URL + "/content/taskStatus?id=" + id,{},
      {
        headers: { Authorization: `Bearer ${token}` },
      }
    );
    TasksObs.next(data.payload);
    return 200;
  } catch (error) {
    toast.error((error as AxiosError).message);
    return (error as AxiosError).response!.status || 500;
  }
};

export const deleteTask = async (id: string): Promise<number> => {
  try {
    const user = window.sessionStorage.getItem("notes_session");
    if (!user) {
      return 404;
    }
    const userObj = JSON.parse(user) as User;
    const {token } = userObj;
    const { data } = await axios.delete<CustomResponse<Task[]>>(
      SERVER_URL + "/content/task?id=" + id,
      {
        headers: { Authorization: `Bearer ${token}` },
      }
    );
    TasksObs.next(data.payload);
    return 200;
  } catch (error) {
    toast.error((error as AxiosError).message);
    return (error as AxiosError).response!.status || 500;
  }
};