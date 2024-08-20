import { BehaviorSubject } from "rxjs";
import { OutUser, User } from "../types";
import axios, { AxiosError } from "axios";
import toast from "react-hot-toast";

const SERVER_URL = 'http://www.local-server.com:3000';

const UserObs = new BehaviorSubject<User | null>(null);

export const signUp = async (user: OutUser): Promise<boolean> => {
    try {
        const { data } = await axios.post(SERVER_URL + '/user/sign-up', user);
        if(!data.success){
            throw new Error(data.message);
        }
        window.sessionStorage.setItem('notes_sesion', JSON.stringify(data.payload));
        UserObs.next(data.payload);
        toast.success('Successful sign in');
        return true;
    } catch (error) {
        toast.error(`${(error as AxiosError).request.statusText}: ${(error as any).response?.data.code}`);
        return false;
    }
}


export default UserObs;