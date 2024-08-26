import React, { useEffect } from "react";
import "./App.scss";
import UserObs from "./store/User";
import { User } from "./types";
import withAuth from "./HOC/withAuth";
import { addTask, getDict, WordDictObs } from "./store/Content";
import NavBar from "./components/Navbar/Navbar";
import toast from "react-hot-toast";
import { faSquarePlus } from "@fortawesome/free-regular-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useNavigate } from "react-router-dom";
import TaskList from "./components/TaskList/TaskList";

const App = () => {
  const [user, setUser] = React.useState<User | null>(null);
  const [words, setDictItems] = React.useState<string[] | null>([]);
  const [isLoading, setIsLoading] = React.useState<boolean>(false);
  const [taskValue, setTaskValue] = React.useState<string>("");
  const [retrieved, setRetrieved] = React.useState<boolean>(false);

  const navigate = useNavigate();

  const handleAddTask = async () => {
    if (taskValue.length <= 0) {
      toast.error("value needs to contain a word");
      return;
    }
    setIsLoading(true);
    if (user?.token) {
      const isDone = await addTask(taskValue);
      console.log('isDone', isDone);
      if (isDone !== 200) {
        setIsLoading(true);
        toast.custom("Something wet wrong. Code: " + isDone, {
          style: { color: "red" },
        });
        if (isDone === 404) {
          navigate("/entrance/login");
        }
      }
      setIsLoading(true);
    } else {
      toast.custom("Something wet wrong with token", {
        style: { color: "red" },
      });
    }
  };
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
          <div
            className={`control is-large ${isLoading ? "is-loading" : ""} `}
            style={{ display: "flex" }}
          >
            <input
              onFocus={async () => {
                setIsLoading(true);
                setRetrieved(true);
                if (user?.token) {
                  if (!retrieved) {
                    const isDone = await getDict(user?.token);
                    if (isDone !== 200) {
                      setIsLoading(true);
                      toast.custom("Something wet wrong. Code: " + isDone, {
                        style: { color: "red" },
                      });
                      if (isDone === 404) {
                        navigate("/entrance/login");
                      }
                    }
                    setIsLoading(true);
                  }
                } else {
                  toast.custom("Something wet wrong with token", {
                    style: { color: "red" },
                  });
                }
              }}
              onKeyDown={async (e: React.KeyboardEvent<HTMLInputElement>) => {
                if (e.nativeEvent.key === "Enter") {
                  await handleAddTask();
                }
              }}
              className="input is-large mr-2"
              type="text"
              placeholder="Large loading input"
              onChange={(e) => setTaskValue(e.target.value)}
              value={taskValue}
            />
            <button
              className="button is-dark"
              onClick={async () => await handleAddTask()}
            >
              <FontAwesomeIcon icon={faSquarePlus} size={"2x"} />
            </button>
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
        <TaskList />
      </div>
    </>
  );
};

export default withAuth(App);
