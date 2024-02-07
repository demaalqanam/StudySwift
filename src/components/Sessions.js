import React, { useState } from "react";
import { FaGear } from "react-icons/fa6";
import { useTimer } from "react-timer-hook";

function Sessions() {
  const time = new Date();
  const [showChooseTime, setShowChooseTime] = useState(false);
  const [choosedTime, setChoosedTime] = useState();
  time.setSeconds(time.getSeconds() + 600); // 10 minutes timer

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
    onExpire: () => console.warn("onExpire called"),
  });

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
        <button className="btn">Set</button>
      </div>
    );
  };
  return (
    <div className="sessions">
      <div className="timer">
        <div className="timer-h">
          {showChooseTime ? choseTimeInput() : ""}
          <h3>Study Timer</h3>
          <div className="timer-type">
            <button className="btn active">Pomodoro</button>
            <button className="btn">Timer</button>
          </div>
        </div>
        <div className="t-numbers">
          <div>
            <span>{days}</span>:<span>{hours}</span>:<span>{minutes}</span>:
            <span>{seconds}</span>
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
              time.setSeconds(time.getSeconds() + 600);
              restart(time);
            }}
          >
            Restart
          </button>
        </div>
      </div>
    </div>
  );
}

export default Sessions;
