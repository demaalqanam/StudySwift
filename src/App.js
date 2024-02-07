import "./Style/App.css";
import "./Style/sass/components/Header.scss";
import "./Style/sass/components/SignIn.scss";
import "./Style/sass/components/SignUp.scss";
import "./Style/sass/components/goals.scss";
import "./Style/sass/components/tasks.scss";
import "./Style/sass/components/sessions.scss";
import "../node_modules/bootstrap/dist/css/bootstrap.min.css";
import { Home } from "./pages/Home";
import { Sidebar } from "./components/Sidebar";
import Header from "./components/Header";

import { MyContext } from "./Context/Context";
import { useState } from "react";
import SignIn from "./components/SignIn";
import SignUp from "./components/SignUp";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Goals from "./pages/Goals";
import Tasks from "./pages/Tasks";
import Sessions from "./components/Sessions";

function App() {
  const [theme, setTheme] = useState("light");
  const [overlay, setOverlay] = useState(false);
  const [login, setLogin] = useState(false);
  const [Signup, setSignup] = useState(false);
  const [count, setCount] = useState(0);
  const handleRerender = () => {
    setCount(count + 1);
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
      }}
    >
      <Router>
        <div className="App" id={theme}>
          <video autoPlay muted loop id="myVideo">
            <source
              src="https://firebasestorage.googleapis.com/v0/b/study-swift-be3d8.appspot.com/o/456055_Bangkok_Thailand_Asia_3840x2160.mp4?alt=media&token=b1d0f786-ab5d-494c-adf2-91c57d362ba0"
              type="video/mp4"
            />
            Your browser does not support HTML5 video.
          </video>
          <Sidebar />
          <Header />
          <div className="container">
            {overlay ? <div className="overlay"></div> : ""}
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/Goals" element={<Goals />} />
              <Route path="/Tasks" element={<Tasks />} />
              <Route path="/Sessions" element={<Sessions />} />
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
