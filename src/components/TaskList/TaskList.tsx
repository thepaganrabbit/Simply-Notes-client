import React from "react";
import { Task } from "../../types";
import { completeTask, getTasks, TasksObs } from "../../store/Content";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTrashCan } from "@fortawesome/free-regular-svg-icons";

const TaskList = (): React.ReactElement => {
  const [tasks, setTasks] = React.useState<Task[] | null>(null);
  const fetchTasks = async () => {
    await getTasks();
}
 const handleCompleteTask = async (id: string) => {
    await completeTask(id);
 }
  React.useEffect(() => {
    
    if(tasks === null ) {
        fetchTasks();
    }
    const sub = TasksObs.asObservable().subscribe((tasks) => setTasks(tasks));
    return () => sub.unsubscribe();
  }, [tasks, fetchTasks]);

  return (
    <div className="container">
      <ol>
        {tasks && tasks?.length > 0 && tasks !== null ? (
          tasks.map((task) => (
            <li key={task._id}>
              <div className="columns" onDoubleClick={() => handleCompleteTask(task._id)}>
                <div className="column" style={{textDecoration: task.completed ? 'Line-through' : ''}}>{task.text}</div>
                <div className="column">
                    <input type="checkbox" checked={task.completed}  onChange={(e) => {
                        handleCompleteTask(task._id)
                    }} style={{marginRight: 9}}/>
                        <FontAwesomeIcon icon={faTrashCan} color="red" />
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
