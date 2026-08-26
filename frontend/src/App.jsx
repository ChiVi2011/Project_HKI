import "./App.css";
import { Routes, Route, useLocation } from "react-router-dom";
import Home from "./pages/home";
import Header from "./components/header";
import Login from "./pages/login";
import SignUp from "./pages/signup";
import ForgotPass from "./pages/forgot-passwork";
import AuthLayout from "./layouts/AuthLayout";
function App() {
  const location = useLocation();
  const hiddenHearderRouter = ["/login", "/forgotPass", "/signup"];
  const isHidden = hiddenHearderRouter.includes(location.pathname);
  return (
    <>
      <div className="container-fluid">
        {!isHidden && <Header />}
        <Routes>
          <Route path="/home" element={<Home />} />

          <Route element={<AuthLayout />}>
            <Route path="/login" element={<Login />} />
            <Route path="/forgotPass" element={<ForgotPass />} />
            <Route path="/SignUp" element={<SignUp />} />
          </Route>
        </Routes>
      </div>
    </>
  );
}

export default App;
