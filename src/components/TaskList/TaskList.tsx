import React from "react";
import { InTask, InUser, Task, User } from "../../types";
import {
  completeTask,
  deleteTask,
  getAllTasks,
  getTasks,
  TasksObs,
} from "../../store/Content";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTrashCan } from "@fortawesome/free-regular-svg-icons";
import { useLocation, useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import UserObs, { getUserLocal, UsersObs } from "../../store/User";

const TaskList = (): React.ReactElement => {
  const [tasks, setTasks] = React.useState<InTask[] | null>(null);

  const location = useLocation();
  const [user, setUser] = React.useState<User | null>(null)
  const [users, setUsers] = React.useState<InUser[] | null>(null)

  const nav = useNavigate();
  const fetchTasks = async () => {
    const success = await getTasks();
    if(success === 403) {
      toast.error('You have been logged out');
      nav('/entrance/login');
    }
  };

  const fetchAllTasks = async () => {
    const success = await getAllTasks();
    if(success > 220) {
      toast.error('An error occurred when fetching all tasks.');
    }
  }
  const handleCompleteTask = async (id: string) => {
    await completeTask(id);
  };
  React.useEffect(() => {
    if (user?.isAdmin && location.pathname.match(/(admin)/gm)) {
      fetchAllTasks();
    } else if(!tasks){
      fetchTasks();
    }
    
    const sub = TasksObs.asObservable().subscribe((tasks) => setTasks(tasks));
    const userSub = UserObs.asObservable().subscribe((usr) => setUser(usr));
    return () => {
      sub.unsubscribe();
      userSub.unsubscribe();
    }
  }, [ user, tasks]);

  if(!user) return <button className="button is-loading"></button>

  return (
    <div className="box">
      <ol>
        {tasks && tasks?.length > 0 && tasks !== null ? (
          tasks.map((task) => (
            <li key={task._id}>
              <div
                className="columns"
                onDoubleClick={() => !location.pathname.match(/(admin)/gm) && handleCompleteTask(task._id)}
              >
                <div
                  className="column"
                  style={{
                    textDecoration: task.completed ? "Line-through" : "",
                  }}
                >
                  {task.text}
                </div>
                <div
                  className="column"
                  style={{
                    textDecoration: task.completed ? "Line-through" : "",
                  }}
                >
                  {task.category}
                </div>
                {!location.pathname.match(/(admin)/gm) && (
                  <div className="column">
                  <input
                    type="checkbox"
                    checked={task.completed}
                    onChange={(e) => {
                       handleCompleteTask(task._id);
                    }}
                    style={{ marginRight: 9 }}
                  />
                  <FontAwesomeIcon
                    icon={faTrashCan}
                    color="red"
                    onClick={async () => deleteTask(task._id)}
                  />
                </div>
                )}
                {user.isAdmin && (
                  <div className="column">
                  <p className="is-size-4 is-uppercase">{getUserLocal(task.userId)}</p>
                </div>
                )}
              </div>
            </li>
          ))
        ) : (
          <p>No Tasks available...</p>
        )}
      </ol>
    </div>
  );
};

export default TaskList;
