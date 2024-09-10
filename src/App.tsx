import React, { useEffect } from "react";
import "./App.scss";
import UserObs from "./store/User";
import { Category, User } from "./types";
import withAuth from "./HOC/withAuth";
import {
  addTask,
  CategoriesObs,
  getCategories,
  getDict,
  WordDictObs,
} from "./store/Content";
import NavBar from "./components/Navbar/Navbar";
import toast from "react-hot-toast";
import { faSquarePlus } from "@fortawesome/free-regular-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useNavigate } from "react-router-dom";
import TaskList from "./components/TaskList/TaskList";
import DictList from "./components/DictList/DictList";
import CategorySelection from "./components/CategorySelection/CategorySelection";
import CategorySelect from "./components/CategorySelect/CategorySelect";
import { faClose } from "@fortawesome/free-solid-svg-icons";

const App = () => {
  const [user, setUser] = React.useState<User | null>(null);
  const [isLoading, setIsLoading] = React.useState<boolean>(false);
  const [showWords, setShowWords] = React.useState<boolean>(false);
  const [taskValue, setTaskValue] = React.useState<string>("");
  const [category, setCategory] = React.useState<string>("Default");
  const [retrieved, setRetrieved] = React.useState<boolean>(false);


  const navigate = useNavigate();

  const handleAddTask = async (): Promise<number> => {
    if (taskValue.length <= 0) {
      toast.error("value needs to contain a word");
      return 500;
    }
    setIsLoading(true);
    if (user?.token) {
      const isDone = await addTask({ text: taskValue, category });
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
      return isDone;
    } else {
      toast.custom("Something wet wrong with token", {
        style: { color: "red" },
      });
      return 500;
    }
  };
  useEffect(() => {
    const sub = UserObs.asObservable().subscribe((user) => {
      setUser(user);
    });
   
    return () => {
      sub.unsubscribe();
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
            <CategorySelect state={category} action={setCategory} />
            <input
              onFocus={async () => {
                setIsLoading(true);
                setRetrieved(true);
                setShowWords(true);
                if (!retrieved) {
                  const isDone = await getDict();
                  if (isDone !== 200) {
                    setIsLoading(true);
                    toast.custom("Something wet wrong. Code: " + isDone, {
                      style: { color: "red" },
                    });
                    if (isDone === 404) {
                      navigate("/entrance/login");
                    }
                  }
                  setIsLoading(false);
                }
                setIsLoading(false);
              }}
              onKeyDown={async (e: React.KeyboardEvent<HTMLInputElement>) => {
                if (e.nativeEvent.key === "Enter") {
                  const successful = await handleAddTask();
                  if (successful === 200) {
                    setTaskValue("");
                  }
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
              onClick={async () => {
                const successful = await handleAddTask();
                if (successful === 200) {
                  setTaskValue("");
                }
              }}
            >
              <FontAwesomeIcon icon={faSquarePlus} size={"2x"} />
            </button>
            {showWords ? (
              <button
              className="button is-danger ml-3"
              onClick={() => {
               setShowWords(false);
              }}
            >
              <FontAwesomeIcon icon={faClose} size={"2x"} />
            </button>
            ) : null}
          </div>
          {showWords && (
            <>
            <DictList
              selection={(e) => {
                setTaskValue(e);
                setShowWords(false);
              }}
            />
            </>
          )}
        </div>
        <TaskList />
      </div>
    </>
  );
};

export default withAuth(App);
