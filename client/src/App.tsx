import './App.css'
import {BrowserRouter, Route, Routes} from 'react-router-dom'
import Signin from './components/Signin/signin';
import Signup from './components/Signup/signup';
import { ToastContainer } from 'react-toastify';
import "react-toastify/dist/ReactToastify.css";

function App() {

  return (
    <>
      <BrowserRouter>
        <Routes>
          <Route path="/signin" element={<Signin />} />
          <Route path="/signup" element={<Signup />} />
        </Routes>
      </BrowserRouter>
      <ToastContainer />
    </>
  );
}

export default App
