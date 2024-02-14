import "./Style/App.css";
import "./Style/sass/components/Header.scss";
import "./Style/sass/components/SignIn.scss";
import "./Style/sass/components/SignUp.scss";
import "./Style/sass/components/goals.scss";
import "./Style/sass/components/tasks.scss";
import "./Style/sass/components/sessions.scss";
import "./Style/sass/components/stopWatch.scss";
import "./Style/sass/components/profile.scss";
import "./Style/sass/components/FAQ.scss";
import "../node_modules/bootstrap/dist/css/bootstrap.min.css";
import { Home } from "./pages/Home";
import { Sidebar } from "./components/Sidebar";
import Header from "./components/Header";
import img from "./assets/elegant-cozy-office-space.jpg";
import { MyContext } from "./Context/Context";
import { useEffect, useState } from "react";
import SignIn from "./components/SignIn";
import SignUp from "./components/SignUp";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Goals from "./pages/Goals";
import Tasks from "./pages/Tasks";
import Sessions from "./components/Sessions";
import FAQ from "./pages/FAQ";
import Profile from "./pages/Profile";

const backgrounds = [
  {
    name: "Mountien and clouds.",
    imgURL:
      "https://firebasestorage.googleapis.com/v0/b/study-swift-be3d8.appspot.com/o/files%2F1118437_Pine_High_Panoramic_3840x2160%20(1).mp4?alt=media&token=cadbcdf9-06a7-44a3-89b7-7db8fff03dd5",
  },
  {
    name: "Trees View.",
    imgURL:
      "https://firebasestorage.googleapis.com/v0/b/study-swift-be3d8.appspot.com/o/files%2F1118435_Mystery_Pine_Trunk_3840x2160.mp4?alt=media&token=904a2db4-a6f4-4d84-a183-22ccf4a0d7bc",
  },
  {
    name: "Bangkok City.",
    imgURL:
      "https://firebasestorage.googleapis.com/v0/b/study-swift-be3d8.appspot.com/o/files%2F456055_Bangkok_Thailand_Asia_3840x2160%20(1).mp4?alt=media&token=c57d0441-4f84-4142-a8a6-7bb8102210be",
  },
];
function App() {
  const [theme, setTheme] = useState("light");
  const [overlay, setOverlay] = useState(false);
  const [login, setLogin] = useState(false);
  const [Signup, setSignup] = useState(false);
  const [count, setCount] = useState(0);
  const [currentBGIndex, setCurrentGBIndex] = useState(0);
  const [showTimer, setShowTimer] = useState(true);
  const [showMusicPlayer, setShowMusicPlayer] = useState(true);
  const [showBGChanger, setShowBGChanger] = useState(true);

  const handleRerender = () => {
    setCount(count + 1);
  };

  useEffect(() => {}, []);

  const changeBGForward = () => {
    if (currentBGIndex < 2) {
      setCurrentGBIndex(currentBGIndex + 1);
    } else {
      setCurrentGBIndex(0);
    }
  };
  const changeBGBackward = () => {
    if (currentBGIndex < 2) {
      setCurrentGBIndex(currentBGIndex - 1);
    } else {
      setCurrentGBIndex(0);
    }
  };

  return (
    <MyContext.Provider
      value={{
        theme,
        setTheme,
        overlay,
        setOverlay,
        login,
        Signup,
        setLogin,
        setSignup,
        handleRerender,
        changeBGForward,
        changeBGBackward,
        cuurentBG: backgrounds[currentBGIndex],
        showTimer,
        setShowTimer,
        showMusicPlayer,
        setShowMusicPlayer,
        showBGChanger,
        setShowBGChanger,
      }}
    >
      <Router>
        <div className="App" id={theme}>
          <video
            autoPlay
            muted
            src={backgrounds[currentBGIndex].imgURL}
            loop
            id="myVideo"
          />
          {/* <img id="myVideo" src={img} /> */}
          <Sidebar />
          <Header />
          <div className="container">
            {overlay ? <div className="overlay"></div> : ""}
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/Goals" element={<Goals />} />
              <Route path="/Tasks" element={<Tasks />} />
              <Route path="/Sessions" element={<Sessions />} />
              <Route path="/FAQ" element={<FAQ />} />
              <Route path="/Profile" element={<Profile />} />
            </Routes>
          </div>
          {login ? <SignIn /> : ""}
          {Signup ? <SignUp /> : ""}
        </div>
      </Router>
    </MyContext.Provider>
  );
}

export default App;
