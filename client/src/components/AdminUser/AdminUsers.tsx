import { useContext, useEffect, useState } from "react";
import { Button, FloatingLabel, Form, Modal, Table } from "react-bootstrap";
import { getAllUser } from "../../services/Apis";
import { MyUserContext } from "../../App";
import { Link, useNavigate } from "react-router-dom";
import { User } from "../../interface/User";
import { createUserByAdmin, deleteUser } from "../../services/AuthApis";
import { toast } from "react-toastify";

const AdminUsers = () => {
  const [users, setUsers] = useState<Array<User>>([]);
  const [user, _dispatch] = useContext(MyUserContext);
  const [show, setShow] = useState<boolean>(false);
  const [errors, setErrors] = useState({
    email: "",
    fullName: "",
    password: "",
    phone: "",
  });
  const [createdUser, setCreatedUser] = useState<User>({
    email: "",
    fullName: "",
    password: "",
    phone: "",
    role: "",
  });
  const [active, setActive] = useState<boolean>(false);

  const handleChangeInfo = (evt: any, field: string) => {
    setErrors((prevErrors) => ({
      ...prevErrors,
      [field]: "",
    }));
    setCreatedUser((current) => {
      return { ...current, [field]: evt.target.value };
    });
  };

  const handleClose = () => {
    setShow(false);
    setCreatedUser({
      email: "",
      fullName: "",
      password: "",
      phone: "",
      role: "",
    });
  };

  const handleShow = () => setShow(true);

  const handleCreateUser = () => {
    const msgError: any = {};
    validation(msgError);
    if (Object.keys(msgError).length > 0) {
      setErrors(msgError);
      return;
    }

    createdUser.active = active;

    createUserByAdmin(createdUser).then((res: any) => {
      if (res.status === 201) {
        setUsers([...users, res.data]);
        toast.success("Tạo tài khoản thành công");
        setShow(false);
      }
    });
  };

  const navigate = useNavigate();
  useEffect(() => {
    getAllUser().then((res) => {
      setUsers(res.data);
    });
  }, []);

  const handleDeleteUser = (id: string) => {
    if (confirm("Bạn có chắc chắn muốn xoá người dùng này?")) {
      deleteUser(id).then((res: any) => {
        if (res.status === 200) {
          toast.success("Xoá người dùng thành công");
          setUsers(users.filter((user) => user._id !== id));
        }
      });
    }
  };

  const validation = (msgError: any) => {
    if (!createdUser.email.trim()) {
      msgError.email = "Vui lòng nhập email";
    } else if (
      !createdUser.email.match(
        /^[a-zA-Z0-9_.+-]+@[a-zA-Z0-9-]+\.[a-zA-Z0-9-.]+$/
      )
    ) {
      msgError.email = "Email không hợp lệ";
    }
    if (!createdUser.fullName.trim()) {
      msgError.fullName = "Vui lòng nhập tên đầy đủ";
    }
    if (!createdUser.password.trim()) {
      msgError.password = "Vui lòng nhập mật khẩu";
    }
    if (!createdUser.phone.trim()) {
      msgError.phone = "Vui lòng nhập số điện thoại";
    } else if (!createdUser.phone.match(/^(0[0-9]{9}|[0-9]{10})$/)) {
      msgError.phone = "Số điện thoại không hợp lệ";
    }
  };

  useEffect(() => {
    if (!user || user.role !== "ROLE_ADMIN") return navigate("/forbidden");
  });
  return (
    <>
      <Modal show={show} onHide={handleClose}>
        <Modal.Header closeButton>
          <Modal.Title>Tạo người dùng</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <FloatingLabel className="mt-3" controlId="email" label="Email">
            <Form.Control
              onChange={(evt: any) => handleChangeInfo(evt, "email")}
              type="text"
              placeholder="email"
              isInvalid={!!errors.email}
              value={createdUser.email}
            />
            <Form.Control.Feedback type="invalid">
              {errors.email}
            </Form.Control.Feedback>
          </FloatingLabel>
          <FloatingLabel
            className="mt-3"
            controlId="passsword"
            label="Mật khẩu"
          >
            <Form.Control
              type="password"
              placeholder="password"
              isInvalid={!!errors.password}
              value={createdUser.password}
              onChange={(evt: any) => handleChangeInfo(evt, "password")}
            />
            <Form.Control.Feedback type="invalid">
              {errors.password}
            </Form.Control.Feedback>
          </FloatingLabel>
          <FloatingLabel
            className="mt-3"
            controlId="fullName"
            label="Tên đầy đủ"
          >
            <Form.Control
              type="text"
              placeholder="fullName"
              isInvalid={!!errors.fullName}
              value={createdUser.fullName}
              onChange={(evt: any) => handleChangeInfo(evt, "fullName")}
            />
            <Form.Control.Feedback type="invalid">
              {errors.fullName}
            </Form.Control.Feedback>
          </FloatingLabel>
          <FloatingLabel
            className="mt-3"
            controlId="phone"
            label="Số điện thoại"
          >
            <Form.Control
              type="text"
              placeholder="phone"
              isInvalid={!!errors.phone}
              value={createdUser.phone}
              onChange={(evt: any) => handleChangeInfo(evt, "phone")}
            />
            <Form.Control.Feedback type="invalid">
              {errors.phone}
            </Form.Control.Feedback>
          </FloatingLabel>
          <FloatingLabel className="mt-3" controlId="role" label="Vai trò">
            <Form.Select
              className="mt-3"
              onChange={(evt: any) => handleChangeInfo(evt, "role")}
              value={createdUser.role}
            >
              <option value="ROLE_ADMIN">Admin</option>
              <option value="ROLE_USER">User</option>
            </Form.Select>
          </FloatingLabel>
          <Form.Check
            type="checkbox"
            label="Active"
            className="mt-3"
            checked={active}
            onChange={() => setActive(!active)}
          ></Form.Check>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleClose}>
            Đóng
          </Button>
          <Button variant="primary" onClick={handleCreateUser}>
            Tạo
          </Button>
        </Modal.Footer>
      </Modal>
      <div className="px-5 pt-2">
        <div className="row justify-content-center align-items-center">
          <div className="col-12">
            <h1 className="text-center text-primary">Quản lý người dùng</h1>
            <button className="btn btn-primary my-3" onClick={handleShow}>
              Tạo người dùng
            </button>
            <Table striped hover variant="light">
              <thead>
                <tr>
                  <th >Họ và tên</th>
                  <th>Email</th>
                  <th>Số điện thoại</th>
                  <th>Vai trò</th>
                  <th className="text-center">Trạng thái</th>
                  <th className="text-center">ảnh đại diện</th>
                  <th></th>
                  <th></th>
                  <th></th>
                </tr>
              </thead>
              <tbody>
                {users.map((user, index) => {
                  return (
                    <tr key={index}>
                      <td className="align-middle">{user.fullName}</td>
                      <td className="align-middle">{user.email}</td>
                      <td className="align-middle">{user.phone}</td>
                      <td className="align-middle">{user.role}</td>
                      <td className="align-middle text-center">
                        {user.role ? <i className="fa-solid fa-check"></i> : ""}
                      </td>
                      <td className="text-center">
                        <img src={user.avatar} alt="" width={50} height={50} />
                      </td>
                      {/* <td className="align-middle">
                        <Link to={`/admin/update-user/${user._id}`}>
                          <button type="button" className="btn btn-primary">
                            Cập nhật
                          </button>
                        </Link>
                      </td>
                      <td className="align-middle">
                        <button type="button" className="btn btn-primary">
                          Đổi mật khẩu
                        </button>
                      </td> */}
                      <td className="align-middle">
                        <button
                          type="button"
                          className="btn btn-danger"
                          onClick={() => handleDeleteUser(user._id)}
                        >
                          Xoá
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </Table>
          </div>
        </div>
      </div>
    </>
  );
};
export default AdminUsers;
