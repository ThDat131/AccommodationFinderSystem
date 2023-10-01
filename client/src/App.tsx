import "./App.css";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import Signin from "./pages/Signin/signin";
import Signup from "./pages/Signup/signup";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Main from "./pages/Main/Main";
import { createContext, useReducer } from "react";
import cookie from "react-cookies";
import MyUserReducer from "./reducers/MyUserReducer";
import Setting from "./pages/Setting/Setting";
import LayoutWithHeader from "./pages/LayoutWithHeaders/LayoutWithHeader";
import CreatePost from "./pages/CreatePost/CreatePost";
import LayoutAdmin from "./pages/LayoutAdmin/LayoutAdmin";
import MainAdmin from "./pages/MainAdmin/MainAdmin";
import AdminUsers from "./components/AdminUser/AdminUsers";
import Forbidden from "./pages/Forbidden/Forbidden";
import AdminUpdateUser from "./pages/AdminUpdateUser/AdminUpdateUser";
import Personal from "./pages/Personal/Personal";

export const MyUserContext = createContext(null);

function App() {
  const [user, dispatch] = useReducer(
    MyUserReducer,
    cookie.load("user") || null
  );

  return (
    <>
      <MyUserContext.Provider value={[user, dispatch]}>
        <BrowserRouter>
          <Routes>
            <Route element={<LayoutWithHeader />}>
              <Route path="/" element={<Main />}></Route>
              <Route path="/setting" element={<Setting />} />
              <Route path="/create-post" element={<CreatePost />} />
              <Route path="/personal/:id" element={<Personal />} />
            </Route>
            <Route path="/signin" element={<Signin />} />
            <Route path="/signup" element={<Signup />} />
            <Route path="/forbidden" element={<Forbidden />} />
            <Route element={<LayoutAdmin />}>
              <Route path="/admin" element={<MainAdmin />} />
              <Route path="/admin/users" element={<AdminUsers />} />
              <Route path="/admin/update-user/:id" element={<AdminUpdateUser />} />
            </Route>
          </Routes>
        </BrowserRouter>
      </MyUserContext.Provider>
      <ToastContainer />
    </>
  );
}

export default App;
