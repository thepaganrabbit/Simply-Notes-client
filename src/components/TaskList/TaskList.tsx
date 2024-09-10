import React from "react";
import { InTask, Task } from "../../types";
import {
  completeTask,
  deleteTask,
  getTasks,
  TasksObs,
} from "../../store/Content";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTrashCan } from "@fortawesome/free-regular-svg-icons";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";

const TaskList = (): React.ReactElement => {
  const [tasks, setTasks] = React.useState<InTask[] | null>(null);
  const nav = useNavigate();
  const fetchTasks = async () => {
    const success = await getTasks();
    console.log(success);
    if(success === 403) {
      toast.error('You have been logged out');
      nav('/entrance/login');
    }
  };
  const handleCompleteTask = async (id: string) => {
    await completeTask(id);
  };
  React.useEffect(() => {
    if (tasks === null) {
      fetchTasks();
    }
    const sub = TasksObs.asObservable().subscribe((tasks) => setTasks(tasks));
    return () => sub.unsubscribe();
  }, [tasks, fetchTasks]);

  return (
    <div className="box">
      <ol>
        {tasks && tasks?.length > 0 && tasks !== null ? (
          tasks.map((task) => (
            <li key={task._id}>
              <div
                className="columns"
                onDoubleClick={() => handleCompleteTask(task._id)}
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
