import Form from "react-bootstrap/Form";
import "bootstrap/dist/css/bootstrap.min.css";
import FloatingLabel from "react-bootstrap/esm/FloatingLabel";
import Logo from "../../assets/img/D2 -logos_blue.png";
import Button from "react-bootstrap/Button";
import './signin.css'
import HouseImage from "../../assets/img/house-img.png"
import { Link, useNavigate } from "react-router-dom";
import { useContext, useState } from "react";
import { getCurrentUser, userSignIn } from "../../services/Apis";
import { toast } from "react-toastify";
import cookie from "react-cookies"
import { MyUserContext } from "../../App";

const Signin = () => {

  const nav = useNavigate()

  const [_user, dispatch] = useContext(MyUserContext)

  const [userSignin, setUserSignin] = useState({
    email: "",
    password: ""
  })

  const handleSubmit = (evt) => {
    evt.preventDefault()
    userSignIn(userSignin).then((res) => {
      if (res.status === 200) {
        toast.success("Đăng nhập thành công");
        cookie.save("token", res.data, {})
        getCurrentUser()
        .then(res => {
          if (res.status === 200) {
            cookie.save("user", res.data, {});
            dispatch({
              type: "login",
              payload: res.data,
            });
            nav("/");
          }
        })
      }

      if (res.response.status === 400 || res.response.status === 404) {
        toast.error("Sai tài khoản hoặc mật khẩu");
      }
    });

  }

  return (
    <>
      <div className="d-flex align-items-center justify-content-center">
        <div className="row vh-100 container-fluid rounded px-5" style={{}}>
          <div
            className="col-6"
            style={{
              backgroundImage: `url(${HouseImage})`,
              backgroundRepeat: "no-repeat",
              backgroundPosition: "center",
            }}
          ></div>
          <div className="col-6 d-flex flex-column justify-content-center px-5">
            <div className="text-center">
              <img src={Logo} width={250} height={200} color="#0d6efd"/>
            </div>
            <Form onSubmit={handleSubmit} style={{marginTop: -20}} className="px-5">
              <h1 className="text-center text-primary mb-3">Đăng nhập</h1>
              <FloatingLabel
                controlId="floatingInput"
                label="Địa chỉ email"
                className="mb-3"
              >
                <Form.Control
                  type="email"
                  placeholder="name@example.com"
                  onChange={(e) =>
                    setUserSignin((prevValue) => {
                      return { ...prevValue, email: e.target.value };
                    })
                  }
                />
              </FloatingLabel>
              <FloatingLabel
                controlId="floatingPassword"
                label="Mật khẩu"
                className="mb-3"
              >
                <Form.Control
                  type="password"
                  placeholder="Password"
                  onChange={(e) =>
                    setUserSignin((prevValue) => {
                      return { ...prevValue, password: e.target.value };
                    })
                  }
                />
              </FloatingLabel>
              <div className="d-flex align-items-center justify-content-between mb-3">
                <Form.Check label="Nhớ mật khẩu?" />
                <a href="" className="text-danger">Quên mật khẩu?</a>
              </div>
              <div className="d-grid mb-3">
                <Button variant="primary" size="lg" type="submit">
                  Đăng nhập
                </Button>
              </div>
            </Form>
            <div className="mb-3 d-flex justify-content-center align-items-center gap-2">
              <p className="m-0">chưa đăng ký?</p>
              <Link to={"/signup"}>Đăng ký</Link>
            </div>
            <div className="mb-3 d-flex justify-content-center align-items-center">
              <p className="m-0">Đăng nhập với:</p>
            </div>
            <div className="mb-3 d-flex justify-content-center align-items-center">
              <div className="d-flex gap-2">
                <button type="button" className="btn rounded-circle hover-btn">
                  <i className="fa-brands fa-google"></i>
                </button>
                <button type="button" className="btn rounded-circle hover-btn">
                  <i className="fa-brands fa-facebook"></i>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Signin;
