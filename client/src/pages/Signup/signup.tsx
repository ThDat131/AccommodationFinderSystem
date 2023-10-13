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
        toast.success("Send verify code successfully. Please check your email");
      }
    });
    setTimeout(() => {
      setIsSend(false);
    }, 60000);
  };

  const validation = (msgError: any) => {
    if (!user.email.trim()) {
      msgError.email = "Email is required!";
    } else if (
      !user.email.match(/^[a-zA-Z0-9_.+-]+@[a-zA-Z0-9-]+\.[a-zA-Z0-9-.]+$/)
    ) {
      msgError.email = "Email is invalid!";
    }
    if (!user.fullName.trim()) {
      msgError.fullName = "Full name is required!";
    }
    if (!user.phone.trim()) {
      msgError.phone = "Phone is required!";
    } else if (!user.phone.match(/^(0[0-9]{9}|[0-9]{10})$/)) {
      msgError.phone = "Phone is invalid!";
    }
    if (!user.password.trim()) {
      msgError.password = "Password is required!";
    } else if (
      !user.password.match(
        /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/
      )
    ) {
      msgError.password =
        "Please use at least 8 characters, including uppercase, lowercase, numbers, and special characters for increased security)";
    }
    if (!user.rePassword.trim()) {
      msgError.rePassword = "Confirm password is required!";
    } else if (user.password !== user.rePassword) {
      msgError.rePassword = "Password and confirm password is not match!";
    }
    if (!user.rePassword.trim()) {
      msgError.confirmationCode = "Confirmation code is required!";
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
        toast.success("Signup successfully!");
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
              <h1 className="text-center text-primary mb-3">Sign up</h1>
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
                label="Full Name"
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
                label="Phone"
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
                label="Password"
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
                  label="Confirm Password"
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
                  label="Confirm Code"
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
                  {!isSend ? "Send code" : `Please wait ${timer} seconds`}
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
                  Sign Up
                  {disabled && <Spinner />}
                </Button>
              </div>
            </Form>
            <div className="mb-3 d-flex justify-content-center align-items-center gap-2">
              <p className="m-0">Already sign up?</p>
              <Link to={"/signin"}>Sign in</Link>
            </div>
            <div className="d-flex justify-content-center align-items-center gap-2">
              <p className="m-0">Or sign up with:</p>
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
