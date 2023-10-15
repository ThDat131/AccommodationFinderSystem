import Form from "react-bootstrap/Form";
import "bootstrap/dist/css/bootstrap.min.css";
import FloatingLabel from "react-bootstrap/esm/FloatingLabel";
import Button from "react-bootstrap/Button";
import "./signup.css";
import HouseImage from "../../assets/img/house-img.png";
import { Link, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import InputGroup from "react-bootstrap/InputGroup";
import { sendConfirmCode, userSignUp } from "../../services/Apis";
import { toast } from "react-toastify";
import Spinner from "react-bootstrap/Spinner";

const Signup = () => {
  const nav = useNavigate();

  const [user, setUser] = useState({
    fullName: "",
    email: "",
    phone: "",
    password: "",
    rePassword: "",
    confirmationCode: "",
  });

  const [errors, setErrors] = useState({
    fullName: "",
    email: "",
    phone: "",
    password: "",
    rePassword: "",
    confirmationCode: "",
  });

  const [timer, setTimer] = useState<number>(60);
  const [isSend, setIsSend] = useState(false)

  const [disabled, setDisabled] = useState(false);

  const handleChangeUser = (evt, field) => {
    setErrors((prevErrors) => ({
      ...prevErrors,
      [field]: "",
    }));
    setUser((current) => {
      return { ...current, [field]: evt.target.value };
    });
  };

  useEffect(() => {
    const interval = setInterval(() => {
      setTimer((prevTimer) => prevTimer - 1);
    }, 1000);
    return () => {
      clearInterval(interval);
    };
  }, [isSend]);

  const sendCode = () => {
    const msgError: any = {};
    validation(msgError);
    if (Object.keys(msgError).length > 0) {
      setErrors(msgError);
      setDisabled(false);
      return;
    }
    setTimer(60);
    setIsSend(true);

    sendConfirmCode({
      email: user.email,
    }).then((res) => {
      if (res.status === 200) {
        toast.success("Gửi mã xác nhận thành công. Vui lòng kiểm tra email của bạn");
      }
    });
    setTimeout(() => {
      setIsSend(false);
    }, 60000);
  };

  const validation = (msgError: any) => {
    if (!user.email.trim()) {
      msgError.email = "Email không được để trống!";
    } else if (
      !user.email.match(/^[a-zA-Z0-9_.+-]+@[a-zA-Z0-9-]+\.[a-zA-Z0-9-.]+$/)
    ) {
      msgError.email = "Email không tồn tại!";
    }
    if (!user.fullName.trim()) {
      msgError.fullName = "Tên đầy đủ không được để trống!";
    }
    if (!user.phone.trim()) {
      msgError.phone = "Số điện thoại không được để trống!";
    } else if (!user.phone.match(/^(0[0-9]{9}|[0-9]{10})$/)) {
      msgError.phone = "Số điện thoại không tồn tại!";
    }
    if (!user.password.trim()) {
      msgError.password = "Mật khẩu không được để trống!";
    } else if (
      !user.password.match(
        /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/
      )
    ) {
      msgError.password =
      "Mật khẩu phải có ít nhất 8 ký tự và phải có ký tự thường, ký tự in hoa và ký tự đặc biệt";
    }
    
    if (!user.rePassword.trim()) {
      msgError.rePassword = "Nhập lại mật khẩu không được để trống!";
    } else if (user.password !== user.rePassword) {
      msgError.rePassword = "Mật khẩu không trùng khớp!";
    }
    if (!user.rePassword.trim()) {
      msgError.confirmationCode = "Mã xác nhận không được để trống!";
    }
  };

  const handleSubmit = (evt) => {
    evt.preventDefault();
    setDisabled(true);
    const msgError: any = {};
    validation(msgError)

    if (Object.keys(msgError).length > 0) {
      setErrors(msgError);
      setDisabled(false);
      return;
    }

    const formData = {};
    for (const field in user) {
      if (field !== "rePassword") {
        formData[`${field}`] = user[field].trim();
      }
    }
    userSignUp(formData).then((res) => {
      if (res.status === 201) {
        toast.success("Đăng ký thành công!");
        setUser({
          fullName: "",
          email: "",
          phone: "",
          password: "",
          rePassword: "",
          confirmationCode: ""
        });
        nav("/signin");
      } else if (res.status === 400) {
        if (res.email) {
          errors.email = res.email
        }
        if (res.phone) {
          errors.phone = res.phone
        }
        if (res.confirmationCode) {          
          errors.confirmationCode = res.confirmationCode;
        }
      }
      setDisabled(false);
    });
  };

  return (
    <>
      <div className="container vh-100 d-flex align-items-center">
        <div className="row container-fluid rounded p-5 h-100" style={{}}>
          <div
            className="col-6"
            style={{
              backgroundImage: `url(${HouseImage})`,
              backgroundRepeat: "no-repeat",
              backgroundPosition: "center",
            }}
          ></div>
          <div className="col-6 d-flex flex-column justify-content-center px-5">
            <Form noValidate onSubmit={handleSubmit}>
              <h1 className="text-center text-primary mb-3">Đăng ký</h1>
              <FloatingLabel
                controlId="floatingInput"
                label="Email"
                className="mb-3"
              >
                <Form.Control
                  type="email"
                  placeholder="name@example.com"
                  onChange={(e) => handleChangeUser(e, "email")}
                  value={user.email}
                  isInvalid={!!errors.email}
                />
                <Form.Control.Feedback type="invalid">
                  {errors.email}
                </Form.Control.Feedback>
              </FloatingLabel>
              <FloatingLabel
                controlId="floatingFullName"
                label="Tên đầy đủ"
                className="mb-3"
              >
                <Form.Control
                  type="text"
                  placeholder="fullName"
                  onChange={(e) => handleChangeUser(e, "fullName")}
                  value={user.fullName}
                  isInvalid={!!errors.fullName}
                />
                <Form.Control.Feedback type="invalid">
                  {errors.fullName}
                </Form.Control.Feedback>
              </FloatingLabel>
              <FloatingLabel
                controlId="floatingPhone"
                label="Số điện thoại"
                className="mb-3"
              >
                <Form.Control
                  type="text"
                  placeholder="Phone"
                  onChange={(e) => handleChangeUser(e, "phone")}
                  value={user.phone}
                  isInvalid={!!errors.phone}
                />
                <Form.Control.Feedback type="invalid">
                  {errors.phone}
                </Form.Control.Feedback>
              </FloatingLabel>
              <FloatingLabel
                controlId="floatingPassword"
                label="Mật khẩu"
                className="mb-3"
              >
                <Form.Control
                  type="password"
                  placeholder="Password"
                  onChange={(e) => handleChangeUser(e, "password")}
                  value={user.password}
                  isInvalid={!!errors.password}
                />
                <Form.Control.Feedback type="invalid">
                  {errors.password}
                </Form.Control.Feedback>
              </FloatingLabel>
              <InputGroup>
                <FloatingLabel
                  controlId="floatingRePassword"
                  label="Nhập lại mật khẩu"
                  className="mb-3"
                >
                  <Form.Control
                    type="password"
                    placeholder="Password"
                    onChange={(e) => handleChangeUser(e, "rePassword")}
                    isInvalid={!!errors.rePassword}
                    value={user.rePassword}
                  />
                  <Form.Control.Feedback type="invalid">
                    {errors.rePassword}
                  </Form.Control.Feedback>
                </FloatingLabel>
              </InputGroup>
              <div className="d-flex justify-content-between align-items-center">
                <FloatingLabel
                  controlId="floatingConfirmationCode"
                  label="Mã xác nhận"
                  className="mb-3 w-50"
                >
                  <Form.Control
                    type="text"
                    placeholder="ConfirmationCode"
                    onChange={(e) => handleChangeUser(e, "confirmationCode")}
                    isInvalid={!!errors.confirmationCode}
                    value={user.confirmationCode}
                  />
                  <Form.Control.Feedback type="invalid">
                    {errors.confirmationCode}
                  </Form.Control.Feedback>
                </FloatingLabel>
                <Button
                  className="mb-3"
                  variant="primary"
                  size="lg"
                  type="button"
                  onClick={sendCode}
                  disabled={isSend}
                >
                  {!isSend ? "Gửi mã" : `Vui lòng đợi ${timer} giây`}
                </Button>
              </div>

              <div className="d-grid mb-3">
                <Button
                  variant="primary"
                  size="lg"
                  type="submit"
                  disabled={disabled}
                  className="d-flex justify-content-center align-items-center gap-2"
                >
                  Đăng ký
                  {disabled && <Spinner />}
                </Button>
              </div>
            </Form>
            <div className="mb-3 d-flex justify-content-center align-items-center gap-2">
              <p className="m-0">Đã đăng ký?</p>
              <Link to={"/signin"}>Đăng nhập</Link>
            </div>
            <div className="d-flex justify-content-center align-items-center gap-2">
              <p className="m-0">Đăng ký với:</p>
              <div className="d-flex justify-content-center align-items-center">
                <div className="d-flex gap-2">
                  <button
                    type="button"
                    className="btn rounded-circle hover-btn"
                  >
                    <i className="fa-brands fa-google"></i>
                  </button>
                  <button
                    type="button"
                    className="btn rounded-circle hover-btn"
                  >
                    <i className="fa-brands fa-facebook"></i>
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Signup;
