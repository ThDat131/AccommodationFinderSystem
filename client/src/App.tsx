import './App.css'
import {BrowserRouter, Route, Routes} from 'react-router-dom'
import Signin from './pages/Signin/signin';
import Signup from './pages/Signup/signup';
import { ToastContainer } from 'react-toastify';
import "react-toastify/dist/ReactToastify.css";
import Main from './pages/Main/Main';
import { createContext, useReducer } from 'react';
import cookie from 'react-cookies'
import MyUserReducer from './reducers/MyUserReducer';
import Setting from './pages/Setting/Setting';
import LayoutWithHeader from './pages/LayoutWithHeaders/LayoutWithHeader';

export const MyUserContext = createContext(null);

function App() {

  const [user, dispatch] = useReducer(MyUserReducer, cookie.load("user") || null)

  return (
    <>
      <MyUserContext.Provider value={[user, dispatch]}>
        <BrowserRouter>
          <Routes>
            <Route element={<LayoutWithHeader />}>
              <Route path="/" element={<Main />}></Route>
              <Route path="/setting" element={<Setting />} />
            </Route>
            <Route path="/signin" element={<Signin />} />
            <Route path="/signup" element={<Signup />} />
          </Routes>
        </BrowserRouter>
      </MyUserContext.Provider>
      <ToastContainer />
    </>
  );
}

export default App
