import React, { useEffect } from "react";
import "./App.scss";
import UserObs from "./store/User";
import { User } from "./types";
import withAuth from "./HOC/withAuth";
import { getDict, WordDictObs } from "./store/Content";
import NavBar from "./components/Navbar/Navbar";
import toast from "react-hot-toast";

const App = () => {
  const [user, setUser] = React.useState<User | null>(null);
  const [words, setDictItems] = React.useState<string[] | null>([]);
  const [isLoading, setIsLoading] = React.useState<boolean>(false);
  
  useEffect(() => {
    const sub = UserObs.asObservable().subscribe((user) => {
      setUser(user);
    });
    const dict = WordDictObs.asObservable().subscribe((dicti) =>
      setDictItems(dicti)
    );

    return () => {
      sub.unsubscribe();
      dict.unsubscribe();
    };
  }, [user]);
  return (
    <>
      <NavBar name={user?.name} />
      <div className="container">
        <div className="field">
          <div className={`control is-large ${isLoading ? 'is-loading' : ''} `}>
            <input
              onFocus={async () => {
                setIsLoading(true);
                if(user?.token){
                  const isDone = await getDict(user?.token);
                  setIsLoading(isDone && false )
                } else {
                  toast.custom('Something wet wrong with token', {style:{color: 'red'}})
                }
              }}
              className="input is-large"
              type="text"
              placeholder="Large loading input"
            />
          </div>
          {words && words.length > 0 && (
            <div
              className="box"
              style={{
                maxHeight: 130,
                overflow: "hidden",
                overflowY: "scroll",
              }}
            >
              <ul>
                <li>
                  <button className="is-ghost">Kellogs Cereal</button>
                </li>
                <li>
                  <button className="is-ghost">Kellogs Cereal</button>
                </li>
                <li>
                  <button className="is-ghost">Kellogs Cereal</button>
                </li>
                <li>
                  <button className="is-ghost">Kellogs Cereal</button>
                </li>
                <li>
                  <button className="is-ghost">Kellogs Cereal</button>
                </li>
                <li>
                  <button className="is-ghost">Kellogs Cereal</button>
                </li>
              </ul>
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default withAuth(App);
