import React, { useContext, useEffect, useState } from "react";
import { IoMdAdd } from "react-icons/io";
import { IoClose } from "react-icons/io5";
import { FaRegEdit } from "react-icons/fa";
import { FaCheck } from "react-icons/fa6";
import { MyContext } from "../Context/Context";
import { auth, db } from "../config/firebase";
import {
  addDoc,
  collection,
  deleteDoc,
  doc,
  getDocs,
  query,
  updateDoc,
  where,
} from "firebase/firestore";
import Empty from "../components/Empty";

function Goals() {
  const [showWindow, setShowWindow] = useState(false);
  const { setOverlay, overlay } = useContext(MyContext);
  const [goalsList, setGoalsList] = useState(null);
  const [goalDesc, setGoalDesc] = useState();
  const [goalTitle, SetGoalTitle] = useState();
  const [goalDurationInHour, SetGoalDurationInHour] = useState();
  const [selectedGoal, setSelectedGoal] = useState(null);
  const [areYouSureWindow, setAreYouSureW] = useState(false);
  const [goalDeadline, setGoalDeadline] = useState();
  const [loading, setLoading] = useState(true);
  const goalsCollectionRef = collection(db, "Gooals");

  useEffect(() => {
    auth.onAuthStateChanged(function (user) {
      if (user) {
        getGoals();
        // User is signed in.
      } else {
        console.log("Not Signed in");
        setLoading(false);
        // No user is signed in.
      }
    });
  }, []);

  /// Show add window
  const handleAddWindow = () => {
    clearingFields();
    setOverlay((current) => (current === true ? false : true));
    setShowWindow((current) => (current === true ? false : true));
  };

  // Get goals data
  const getGoals = async () => {
    try {
      const q = query(
        goalsCollectionRef,
        where("owner", "==", auth?.currentUser?.uid)
      );
      const data = await getDocs(q);
      const List = data.docs.map((doc) => ({
        ...doc.data(),
        id: doc.id,
      }));
      setGoalsList(List);
      setLoading(false);
    } catch (error) {
      console.error(error);
    }
  };

  /// Handle create and edit submit action
  const handleCreateGoal = async (e) => {
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

    /// Hours To minutes
    let minutes = goalDurationInHour * 60;

    if (selectedGoal === null) {
      //// Creation
      try {
        await addDoc(goalsCollectionRef, {
          title: goalTitle,
          description: goalDesc,
          deadline: goalDeadline,
          creationDate: dateString,
          owner: auth.currentUser.uid,
          goalInMin: minutes,
          goalInHour: goalDurationInHour,
          cheked: false,
          progress: 0,
        }).then((res) => {
          handleAddWindow();
          getGoals();
        });
      } catch (error) {
        console.error(error);
      }
    } else {
      ////Edit
      updateGoal();
    }
  };

  //   Show Edit window
  const showEdit = (goal) => {
    handleAddWindow();
    setSelectedGoal(goal);

    setGoalDeadline(goal?.deadline);
    setGoalDesc(goal?.description);
    SetGoalTitle(goal?.title);
    SetGoalDurationInHour(goal?.goalInHour);
  };

  ///// Handle submit Edit action
  const updateGoal = async () => {
    /// Hours To minutes
    let minutes = goalDurationInHour * 60;
    const goalDoc = doc(db, "Gooals", selectedGoal.id);
    await updateDoc(goalDoc, {
      title: goalTitle,
      description: goalDesc,
      deadline: goalDeadline,
      goalInMin: minutes,
      goalInHour: goalDurationInHour,
    })
      .then((res) => {
        console.log(res);
        handleAddWindow();
        clearingFields();
        getGoals();
      })
      .catch((err) => console.error(err));
  };

  /// Clearing Fileds ///
  const clearingFields = () => {
    setGoalDeadline("");
    setGoalDesc("");
    SetGoalTitle("");
    SetGoalDurationInHour();
    setSelectedGoal(null);
  };

  ///////////////////////////
  /// Handle Delete Action ///
  const handleDelete = async () => {
    try {
      const goalDoc = doc(db, "Gooals", selectedGoal?.id);
      await deleteDoc(goalDoc).then(() => {
        setAreYouSureW(false);
        setOverlay(false);
        setSelectedGoal();
        getGoals();
      });
    } catch (error) {
      console.error(error);
    }
  };

  ///////////////////////
  // Edit and add form //
  const GoalForm = () => {
    return (
      <div className="goal-form">
        <h4 className="center">Set a goal</h4>
        <form onSubmit={(e) => handleCreateGoal(e)}>
          <div class="form-group m-2">
            <label for="title">Title</label>
            <input
              value={goalTitle}
              onChange={(e) => SetGoalTitle(e.target.value)}
              type="text"
              class="form-control"
              id="title"
            />
          </div>
          <div class="form-group m-2">
            <label for="deadline">Deadline</label>
            <input
              type="date"
              class="form-control"
              id="deadline"
              value={goalDeadline}
              onChange={(e) => setGoalDeadline(e.target.value)}
            />
          </div>
          <div class="form-group m-2" style={{ width: "35%" }}>
            <label for="duration">Study duration (Hours)</label>
            <input
              type="number"
              class="form-control"
              id="duration"
              value={goalDurationInHour}
              onChange={(e) => SetGoalDurationInHour(e.target.value)}
            />
          </div>

          <div class="form-group m-2">
            <label for="Password">Description</label>
            <textarea
              rows={6}
              type="password"
              class="form-control"
              id="description"
              value={goalDesc}
              onChange={(e) => setGoalDesc(e.target.value)}
            />
          </div>
          <div className="form-btns m-2">
            <button type="submit" class="btn center create-btn">
              {selectedGoal === null ? " Create" : "Edit"}
            </button>
            <button
              onClick={handleAddWindow}
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

  const areYouSure = () => {
    return (
      <div className="areyousure-window">
        <p>This will be deleted forever?</p>
        <button onClick={handleDelete} className="btn delete">
          Yes, delete
        </button>
        <button
          className="btn cancel-btn"
          onClick={() => {
            setAreYouSureW(false);
            setOverlay(false);
          }}
        >
          Cancel
        </button>
      </div>
    );
  };

  console.log(goalsList);

  return (
    <>
      {showWindow ? GoalForm() : ""}
      {areYouSureWindow ? areYouSure() : ""}
      <div className="goals">
        <div className="goals-header">
          <div className="title">
            <h3>Your Goals</h3>
          </div>
          <button
            disabled={auth.currentUser === null}
            onClick={handleAddWindow}
            className="btn center"
          >
            Set a goal <IoMdAdd className="icon" />
          </button>
        </div>

        <div className="golas-cont">
          {/* {goalsList == null ? <Empty /> : ""} */}
          {loading ? (
            <div className="loading-c center">
              <div class="spinner-border" role="status"></div>
            </div>
          ) : goalsList?.length === 0 || goalsList === null ? (
            <Empty />
          ) : (
            goalsList?.map((goal, index) => {
              return (
                <div className="goal-item">
                  <div className="g-check">
                    {goal?.cheked ? (
                      <>
                        {" "}
                        <FaCheck className="check-i" />
                        <p>Goal Reached</p>
                      </>
                    ) : (
                      ""
                    )}
                  </div>
                  <div className="goal-header">
                    <div className="icons">
                      <h4 className="center">{index + 1}</h4>
                      <FaRegEdit
                        onClick={() => showEdit(goal)}
                        className="icon"
                      />
                      <IoClose
                        onClick={() => {
                          setAreYouSureW(true);
                          setOverlay(true);
                          setSelectedGoal(goal);
                        }}
                        className="icon"
                      />
                    </div>
                    <div className="goal-title">
                      <h3>{goal?.title}</h3>
                    </div>
                  </div>
                  <div className="g-middle">
                    <p>{goal?.description}</p>
                    <div className="goal-dates">
                      <div className="dates">
                        <p>Creation date:</p> <p>{goal?.creationDate}</p>
                      </div>
                      <div className="dates">
                        <p>Deadline:</p> <p>{goal?.deadline}</p>
                      </div>
                      <div className="dates">
                        <p>Study duration:</p> <p>{goal.goalInHour} (Hours)</p>
                      </div>
                    </div>
                  </div>
                  <div className="g-progress">
                    <div className="p-parent">
                      <span
                        style={{ width: `${goal?.progress}%` }}
                        className="p-child"
                      ></span>
                    </div>
                    <div className="p-number">{goal?.progress}%/100</div>
                  </div>
                </div>
              );
            })
          )}
        </div>
      </div>
    </>
  );
}

export default Goals;
