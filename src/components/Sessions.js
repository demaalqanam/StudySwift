import React, { useContext, useEffect, useRef, useState } from "react";
import { FaGear } from "react-icons/fa6";
import { useTimer } from "react-timer-hook";
import { auth, db } from "../config/firebase";
import { FaForward, FaBackward } from "react-icons/fa";
import { BiHide } from "react-icons/bi";

// import 'react-h5-audio-player/lib/styles.less' Use LESS
// import 'react-h5-audio-player/src/styles.scss' Use SASS
import {
  collection,
  doc,
  getDocs,
  query,
  updateDoc,
  where,
} from "firebase/firestore";
import Stopwatch from "./StopWatch";
import MusicPlayer from "./MusicPlayer";
import { MyContext } from "../Context/Context";

function Sessions() {
  const time = new Date();
  const [showChooseTime, setShowChooseTime] = useState(false);
  const {
    changeBGForward,
    changeBGBackward,
    cuurentBG,
    showTimer,
    setShowTimer,
    showMusicPlayer,
    setShowMusicPlayer,
    showBGChanger,
    setShowBGChanger,
  } = useContext(MyContext);

  const [choosedTime, setChoosedTime] = useState(25);
  const [currentTime, setCurrentTime] = useState(1500);
  const [goalsList, setGoalsList] = useState([]);
  const [selectedGoal, setSelectedGoal] = useState();
  const [showStopWatch, setShowStopWatch] = useState(false);

  const btn1 = useRef();
  const btn2 = useRef();

  time.setSeconds(time.getSeconds() + Number(choosedTime)); // 10 minutes timer
  const goalsCollectionRef = collection(db, "Gooals");
  const {
    totalSeconds,
    seconds,
    minutes,
    hours,
    days,
    isRunning,
    start,
    pause,
    resume,
    restart,
  } = useTimer({
    expiryTimestamp: time,
    onExpire: () => handleUpdateGoal(),
  });

  useEffect(() => {
    pause();
    auth.onAuthStateChanged(function (user) {
      if (user) {
        getGoals();
        // User is signed in.
      } else {
        console.log("Not Signed in");
        // No user is signed in.
      }
    });
  }, []);

  //// Change time action /////
  const handleChangeTime = () => {
    setShowChooseTime(false);
    const time = new Date();
    time.setSeconds(time.getSeconds() + Number(choosedTime) * 60);
    restart(time);
  };

  const choseTimeInput = () => {
    return (
      <div className="chose-time">
        <p>Choose Timer Duration</p>
        <label>Minutes:</label>
        <input
          value={choosedTime}
          onChange={(e) => setChoosedTime(e.target.value)}
          type="number"
        />
        <button onClick={handleChangeTime} className="btn">
          Set
        </button>
      </div>
    );
  };

  // Get goals data
  const getGoals = async () => {
    try {
      const q = query(
        goalsCollectionRef,
        where("owner", "==", auth.currentUser?.uid)
      );
      const data = await getDocs(q);
      const List = data.docs.map((doc) => ({
        ...doc.data(),
        id: doc.id,
      }));
      setGoalsList(List);
    } catch (error) {
      console.error(error);
    }
  };

  /////// Update the goal
  const handleUpdateGoal = async () => {
    if (selectedGoal) {
      let goal = selectedGoal?.split(","); /// this returns undeifind
      const goalDoc = doc(db, "Gooals", goal[0]);
      const newProgress = calculateProgress(goal[1]);
      const oldProgress = Number(goal[2]);
      let calculatedProgress = oldProgress + Number(newProgress.toFixed(1));

      await updateDoc(goalDoc, {
        progress: calculatedProgress,
      })
        .then((res) => {})
        .catch((err) => console.error(err));
    } else return console.log("No goals selected");
  };

  ///calculate progress ///
  const calculateProgress = (goalDuration) => {
    // Calculate percentage
    let percentage = (Number(choosedTime) / Number(goalDuration)) * 100;

    console.log("Percentage of goal achieved: " + percentage + "%");
    return percentage;
  };

  /// Handle navigate timer
  const handleNavigate = (e) => {
    const links = [btn1, btn2];
    setShowStopWatch((current) => (current === true ? false : true));
    links.map((link) => {
      link.current.classList.remove("active");
    });
    e.target.classList.add("active");
  };

  /// Change background component
  const ChnageBGComponent = () => {
    return (
      <div className="change-bg">
        <BiHide
          onClick={() => setShowBGChanger(false)}
          className="icon hide-i"
        />
        <h6>Change the background</h6>
        <p>{cuurentBG?.name}.</p>
        <div className="change-btns">
          <button className="btn center">
            <FaBackward onClick={changeBGBackward} className="icon" />
          </button>
          <button className="btn center">
            <FaForward onClick={changeBGForward} className="icon" />
          </button>
        </div>
      </div>
    );
  };
  return (
    <div className="sessions">
      <div className="row">
        <div className="col">
          <MusicPlayer
            showMusicPlayer={showMusicPlayer}
            setShowMusicPlayer={setShowMusicPlayer}
          />

          {showBGChanger ? <ChnageBGComponent /> : ""}
        </div>
        <div className="col">
          <div
            style={{ display: `${showTimer ? "block" : "none"}` }}
            className="timer"
          >
            <BiHide
              onClick={() => setShowTimer(false)}
              className="icon hide-i"
            />
            <div className="timer-h">
              {showChooseTime ? choseTimeInput() : ""}
              <h3>Study Timer</h3>
              <div className="timer-type">
                <button
                  onClick={(e) => handleNavigate(e)}
                  ref={btn1}
                  className="btn active"
                >
                  Pomodoro
                </button>
                <button
                  onClick={(e) => handleNavigate(e)}
                  ref={btn2}
                  className="btn"
                >
                  Timer
                </button>
              </div>
            </div>
            {showStopWatch ? (
              <Stopwatch />
            ) : (
              <div className="timer-body">
                <div className="t-numbers">
                  <div>
                    <span>{days}</span>:<span>{hours}</span>:
                    <span>{minutes}</span>:<span>{seconds}</span>
                  </div>
                  <div className="g-icon">
                    <button onClick={start}>Start</button>
                    <FaGear
                      onClick={() =>
                        setShowChooseTime((current) =>
                          current === true ? false : true
                        )
                      }
                    />
                  </div>
                </div>
                <div className="timer-btns">
                  <button onClick={pause}>Pause</button>
                  <button onClick={resume}>Resume</button>
                  <button
                    onClick={() => {
                      // Restarts to 5 minutes timer
                      const time = new Date();
                      time.setSeconds(time.getSeconds() + choosedTime * 60);
                      restart(time);
                    }}
                  >
                    Restart
                  </button>
                  <select
                    onChange={(e) => setSelectedGoal(e.target.value)}
                    class="form-select"
                    aria-label="Default select example"
                  >
                    <option selected>
                      {auth.currentUser === null ? "No goals." : "Choose goal."}
                    </option>
                    {goalsList?.map((goal) => {
                      return (
                        <option
                          value={[goal.id, goal.goalInMin, goal.progress]}
                        >
                          {goal?.title}
                        </option>
                      );
                    })}
                  </select>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default Sessions;
