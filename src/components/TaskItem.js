import { doc, updateDoc } from "firebase/firestore";
import React, { useEffect, useState } from "react";
import { FaCheck } from "react-icons/fa6";
import { MdDeleteOutline } from "react-icons/md";
import { db } from "../config/firebase";

function TaskItem({ task, handleDelete, getTasks }) {
  const [taskChecked, setTaskChecked] = useState(false);

  ////////////////////////
  ////Check task ////////
  useEffect(() => {
    if (task?.checked) {
      setTaskChecked(true);
    } else {
      setTaskChecked(false);
    }
  }, []);

  const handleCheckTask = async (task) => {
    console.log(task);
    if (task.checked) {
      setTaskChecked(false);
      const taskDoc = doc(db, "Tasks", task.id);
      await updateDoc(taskDoc, {
        checked: false,
      })
        .then((res) => {
          getTasks();
        })
        .catch((err) => console.error(err));
    } else {
      setTaskChecked(true);
      const goalDoc = doc(db, "Tasks", task.id);
      await updateDoc(goalDoc, {
        checked: true,
      })
        .then((res) => {
          getTasks();
        })
        .catch((err) => console.error(err));
    }
  };

  return (
    <>
      {" "}
      <div className="task-item">
        <div className="t-i-header">
          <div className="i-title">
            <h3
              style={{
                textDecoration: taskChecked ? "line-through" : "",
                color: taskChecked ? "#5b5b5b" : "",
              }}
            >
              {task?.title}
            </h3>
          </div>
          <div className="i-icon">
            <MdDeleteOutline onClick={() => handleDelete(task)} />
          </div>
        </div>
        <div className="i-body">
          <div className="i-desc">
            <p
              style={{
                textDecoration: taskChecked ? "line-through" : "",
                color: taskChecked ? "#5b5b5b" : "",
              }}
            >
              {task?.description}{" "}
            </p>
          </div>
          <div
            onClick={() => handleCheckTask(task)}
            className="i-check-icon center"
          >
            {taskChecked ? <FaCheck /> : ""}
          </div>
        </div>
      </div>
    </>
  );
}

export default TaskItem;
