import React, { useEffect } from "react";
import { useStopwatch } from "react-timer-hook";

function Stopwatch() {
  const {
    totalSeconds,
    seconds,
    minutes,
    hours,
    days,
    isRunning,
    start,
    pause,
    reset,
  } = useStopwatch({ autoStart: true });

  useEffect(() => {
    pause();
  }, []);

  return (
    <div className="stopwatch">
      <div>
        <span>{days}</span>:<span>{hours}</span>:<span>{minutes}</span>:
        <span>{seconds}</span>
      </div>
      <div className="watch-btns">
        <button className="btn" onClick={start}>
          Start
        </button>
        <button className="btn" onClick={pause}>
          Pause
        </button>
        <button className="btn" onClick={reset}>
          Reset
        </button>
      </div>
    </div>
  );
}

export default Stopwatch;
