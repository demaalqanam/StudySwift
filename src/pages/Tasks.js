import React, { useContext, useEffect, useState } from "react";
import { IoMdAdd } from "react-icons/io";
import { FaCheck } from "react-icons/fa6";
import { HiDotsHorizontal } from "react-icons/hi";
import { MyContext } from "../Context/Context";
import {
  addDoc,
  collection,
  deleteDoc,
  doc,
  getDocs,
  orderBy,
  query,
  updateDoc,
  where,
} from "firebase/firestore";
import { auth, db } from "../config/firebase";
import { MdDeleteOutline } from "react-icons/md";
import TaskItem from "../components/TaskItem";
import Empty from "../components/Empty";

function Tasks() {
  const { setOverlay, overlay } = useContext(MyContext);
  const [tasksList, setTasksList] = useState([]);
  const [taskDesc, setTaskDesc] = useState();
  const [taskTitle, SetTaskTitle] = useState();
  const [selectedTask, setSelectedTask] = useState(null);
  const [showTaskForm, setShowTaskForm] = useState(false);
  const [loading, setLoading] = useState(true);

  const tasksCollectionRef = collection(db, "Tasks");

  useEffect(() => {
    auth.onAuthStateChanged(function (user) {
      if (user) {
        getTasks();
        // User is signed in.
      } else {
        console.log("Not Signed in");
        setLoading(false);
        // No user is signed in.
      }
    });
  }, []);

  /// Show create task window
  const showCreateWindow = () => {
    setOverlay((current) => (current === true ? false : true));
    setShowTaskForm((current) => (current === true ? false : true));
  };

  ///////////////////////
  // add form //
  const handlecreateAction = async (e) => {
    e.preventDefault();
    let currentDate = new Date();
    let options = {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "numeric",
      minute: "numeric",
      second: "numeric",
      hour12: true,
    };
    let dateString = currentDate.toLocaleString("en-US", options);

    if (selectedTask === null) {
      //// Creation
      try {
        await addDoc(tasksCollectionRef, {
          title: taskTitle,
          description: taskDesc,
          creationDate: dateString,
          owner: auth.currentUser.uid,
          cheked: false,
        }).then((res) => {
          showCreateWindow();
          getTasks();
          SetTaskTitle("");
          setTaskDesc("");
        });
      } catch (error) {
        console.error(error);
      }
    }
  };

  // Get tasks
  const getTasks = async () => {
    try {
      const q = query(
        tasksCollectionRef,
        where("owner", "==", auth?.currentUser?.uid),
        orderBy("creationDate", "desc")
      );

      const data = await getDocs(q);

      const List = data.docs.map((doc) => ({
        ...doc.data(),
        id: doc.id,
      }));
      setTasksList(List);
      setLoading(false);
    } catch (error) {
      console.error(error);
    }
  };

  ///////////////////////////
  /// Handle Delete Action ///
  const handleDelete = async (task) => {
    try {
      const goalDoc = doc(db, "Tasks", task?.id);
      await deleteDoc(goalDoc).then(() => {
        getTasks();
      });
    } catch (error) {
      console.error(error);
    }
  };

  ///////////////////////////
  /// Add tasks form
  const taskForm = () => {
    return (
      <div className="task-form">
        <h4 className="center">Create a new task.</h4>
        <form>
          <div class="form-group m-2">
            <label for="title">Title</label>
            <input
              value={taskTitle}
              onChange={(e) => SetTaskTitle(e.target.value)}
              type="text"
              class="form-control"
              id="title"
            />
          </div>

          <div class="form-group m-2">
            <label for="Password">Description</label>
            <textarea
              rows={3}
              type="password"
              class="form-control"
              id="description"
              value={taskDesc}
              onChange={(e) => setTaskDesc(e.target.value)}
            />
          </div>
          <div className="form-btns m-2">
            <button
              onClick={handlecreateAction}
              type="submit"
              class="btn center create-btn"
            >
              {selectedTask === null ? " Create" : "Edit"}
            </button>
            <button
              onClick={showCreateWindow}
              type="submit"
              class="btn center cancel-btn"
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    );
  };

  return (
    <div className="tasks">
      {showTaskForm ? taskForm() : ""}
      <div className="tasks-header">
        <div className="h-title">
          <h4>Your Tasks:</h4>
        </div>
        <div className="h-btn center">
          <button onClick={showCreateWindow} className="btn">
            Create Task{" "}
          </button>
          <IoMdAdd className="icon" />
        </div>
      </div>
      <div className="tasks-container ">
        {loading ? (
          <div className="loading-c center">
            <div class="spinner-border" role="status"></div>
          </div>
        ) : tasksList?.length === 0 ? (
          <Empty />
        ) : (
          tasksList?.map((task) => {
            return (
              <TaskItem
                task={task}
                handleDelete={handleDelete}
                getTasks={getTasks}
              />
            );
          })
        )}
      </div>
    </div>
  );
}

export default Tasks;
