import { useEffect, useState } from "react";
import { getUserById } from "../../services/Apis";
import { useParams } from "react-router-dom";
import { FloatingLabel, Form, Spinner } from "react-bootstrap";

const AdminUpdateUser = () => {
  interface User {
    _id: string;
    email: string;
    avatar: string;
    role: string;
    active: boolean;
    fullName: string;
    phone: string;
  }
  const [errors, setErrors] = useState({
    fullName: "",
    phone: "",
    role: "",
  });

  const { id } = useParams();

  const [updatedUser, setUpdatedUser] = useState<User>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [userActive, setUserActive] = useState<boolean>(false);

  useEffect(() => {
    getUserById(id).then((res) => {
      setUpdatedUser(res.data);
      setIsLoading(false);
      setUserActive(res.data.active);
    });
  }, [id]);

  const handleChangeInfo = (evt: any, field: string) => {
    setErrors((prevErrors) => ({
      ...prevErrors,
      [field]: "",
    }));
    setUpdatedUser((current) => {
      return { ...current, [field]: evt.target.value };
    });
    console.log(evt);
  };

  const validation = (msgError: any) => {
    if (!updatedUser.fullName.trim()) {
      msgError.fullName = "Full name is required!";
    }
    if (!updatedUser.phone.trim()) {
      msgError.phone = "Phone is required!";
    } else if (!updatedUser.phone.match(/^(0[0-9]{9}|[0-9]{10})$/)) {
      msgError.phone = "Phone is invalid!";
    }
  };

  const handleUpdateUser = () => {
    const msgError: any = {};
    validation(msgError);
    if (Object.keys(msgError).length > 0) {
      setErrors(msgError);
      return;
    }
    const formData = new FormData();
    formData.append("email", updatedUser.email);
    formData.append("fullName", updatedUser.fullName);
    formData.append("phone", updatedUser.phone);
    formData.append("role", updatedUser.role);
    formData.append("active", userActive.toString());
    // for (var pair of formData.entries()) {
    //   console.log(pair[0] + ", " + pair[1]);
    // }
  };

  if (isLoading)
    return (
      <div className="d-flex align-items-center justify-content-center vh-100">
        <Spinner />
      </div>
    );

  return (
    <>
      <div className="container px-5 pt-2">
        <div className="row justify-content-center align-items-center">
          <div className="col-12">
            <h1 className="text-center text-primary">Update User</h1>
            <FloatingLabel label="Email address" className="mb-3">
              <Form.Control
                type="email"
                placeholder="name@example.com"
                disabled
                value={updatedUser.email}
              />
            </FloatingLabel>
            <FloatingLabel label="Full Name" className="mb-3">
              <Form.Control
                type="text"
                placeholder="Full Name"
                value={updatedUser.fullName}
                isInvalid={!!errors.fullName}
                onChange={(evt) => handleChangeInfo(evt, "fullName")}
              />
              <Form.Control.Feedback type="invalid">
                {errors.fullName}
              </Form.Control.Feedback>
            </FloatingLabel>
            <FloatingLabel label="Phone" className="mb-3">
              <Form.Control
                type="text"
                placeholder="Phone"
                value={updatedUser.phone}
                isInvalid={!!errors.phone}
                onChange={(evt) => handleChangeInfo(evt, "phone")}
              />
              <Form.Control.Feedback type="invalid">
                {errors.phone}
              </Form.Control.Feedback>
            </FloatingLabel>
            <FloatingLabel label="Role" className="mb-3">
              <Form.Select
                value={updatedUser.role}
                onChange={(evt) => handleChangeInfo(evt, "role")}
              >
                <option value="ROLE_USER">User</option>
                <option value="ROLE_ADMIN">Admin</option>
              </Form.Select>
            </FloatingLabel>
            <Form.Check
              type="checkbox"
              label="Active"
              className="mb-3"
              checked={userActive}
              onChange={() => setUserActive(!userActive)}
            />
            <button
              type="button"
              className="btn btn-primary"
              onClick={handleUpdateUser}
            >
              Update
            </button>
          </div>
        </div>
      </div>
    </>
  );
};

export default AdminUpdateUser;
