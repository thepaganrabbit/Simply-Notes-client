import { BehaviorSubject } from "rxjs";
import axios, { AxiosError } from "axios";
import toast from "react-hot-toast";
import { CustomResponse, OutTask, Task, User } from "../types";

const SERVER_URL = "http://www.local-server.com:3000";

export const WordDictObs = new BehaviorSubject<string[] | null>(null);

export const TasksObs = new BehaviorSubject<Task[] | null>(null);

export const getDict = async (token: string): Promise<number> => {
  console.log("called", token);
  try {
    const { data } = await axios.get<CustomResponse<string[]>>(
      SERVER_URL + "/content/dictionary",
      {
        headers: { Authorization: `Bearer ${token}` },
      }
    );
    console.log(data);
    WordDictObs.next(data.payload);
    return 200;
  } catch (error) {
    toast.error((error as AxiosError).message);
    return (error as AxiosError).status || 500;
  }
};



export const getTasks = async (): Promise<number> => {
  try {
    const user = window.sessionStorage.getItem("notes_session");
    if (!user) {
      return 404;
    }
    const token = JSON.parse(user).token;
    console.log(token);
    const { data } = await axios.get<CustomResponse<Task[]>>(
      SERVER_URL + "/content/tasks",
      {
        headers: { Authorization: `Bearer ${token}` },
      }
    );
    console.log('data',data);
    TasksObs.next(data.payload);
    return 200;
  } catch (error) {
    toast.error((error as AxiosError).message);
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
    TasksObs.next(data.payload);
    return 200;
  } catch (error) {
    toast.error((error as AxiosError).message);
    return (error as AxiosError).status || 500;
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
    return (error as AxiosError).status || 500;
  }
};
