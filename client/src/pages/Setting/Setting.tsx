import { useContext, useEffect, useRef, useState } from "react";
import { Button, FloatingLabel, Modal, Tab, Tabs } from "react-bootstrap";
import { Form } from "react-bootstrap";
import { MyUserContext } from "../../App";
import Avatar from "react-avatar-edit";
import { updateUser } from "../../services/Apis";
import { toast } from "react-toastify";
import cookie from "react-cookies";

const urlToObject = async (image) => {
  const response = await fetch(image);
  const blob = await response.blob();
  const file = new File([blob], "image.png", { type: blob.type });
  return file
};

const Setting = () => {
  const avatarFile = useRef(null)
  const [key, setKey] = useState("profile");
  const [isUpdateProfile, setIsUpdateProfile] = useState(false);
  const [user, dispatch] = useContext(MyUserContext);
  const [updateInfoUser, setUpdateInfoUser] = useState(null);
  const [showModalAvatar, setShowModalAvatar] = useState(false);
  const [avatar, setAvatar] = useState(null);
  const [errors, setErrors] = useState({
    fullName: "",
    phone: "",
  });
  const [isLoading, setIsLoading] = useState(false)

  const handleClose = () => {
    setShowModalAvatar(false);
    setAvatar(user.avatar)
  } 
  const handleShow = () => setShowModalAvatar(true);
  const handleSaveImage = () => {
    setShowModalAvatar(false);
  };

  useEffect(() => {
    setUpdateInfoUser(user);
  }, [user]);

  const validation = (msgError: any) => {
     if (!updateInfoUser.fullName.trim()) {
       msgError.fullName = "Full name is required!";
     }
     if (!updateInfoUser.phone.trim()) {
       msgError.phone = "Phone is required!";
     } else if (!updateInfoUser.phone.match(/^(0[0-9]{9}|[0-9]{10})$/)) {
       msgError.phone = "Phone is invalid!";
     }
  }

  const handleUpdateProfile = () => {
    const msgError: any = {};
    if (isUpdateProfile === false) {
      setIsUpdateProfile(true);
      return;
    }
    setIsLoading(true);
    validation(msgError);
    if (Object.keys(msgError).length > 0) {
      setErrors(msgError);
      return;
    }
    const formData = new FormData();

    formData.append("fullName", updateInfoUser.fullName);
    if (avatarFile.current !== null) {
      formData.append("avatar", avatarFile.current);
    } 
    else formData.append("avatar", user.avatar);
    formData.append("phone", updateInfoUser.phone);

    updateUser(user._id, formData).then((res) => {
      if (res.status === 200) {
        toast.success("Update info successfully.");
        console.log(res.data)
        cookie.save("user", res.data, {})
        dispatch({
          type: "update_user",
          payload: res.data,
        });
        setIsUpdateProfile(false);
        setIsLoading(false)
      }
    });
  };

  const handleChangeInfo = (evt, field) => {
    setErrors((prevErrors) => ({
      ...prevErrors,
      [field]: "",
    }));
    setUpdateInfoUser((current) => {
      return { ...current, [field]: evt.target.value };
    });
  };

  const onBeforeFileLoad = (image) => {
    console.log(image.target.files[0].type);
    if(!image && !image.target.files[0].type.startsWith('image/')){
      toast.error("Please input image file!")
      image.target.value = ""
      return
    }
    if (image.target.files[0].size > 10000000) {
      toast.error("File is too big!")
      image.target.value = ""
    }
  };

  const onCrop = (value) => {
    urlToObject(value).then(res => avatarFile.current = res)
    setAvatar(value)
  };

  if (updateInfoUser === null) {
    return;
  }
  return (
    <>
      <Modal show={showModalAvatar} onHide={handleClose}>
        <Modal.Header closeButton>
          <Modal.Title>Update Avatar</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <div className="d-flex align-items-center justify-content-center p-3">
            <Avatar
              width={200}
              height={200}
              src={updateInfoUser.avatar}
              onBeforeFileLoad={onBeforeFileLoad}
              onCrop={onCrop}
            />
          </div>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleClose}>
            Close
          </Button>
          <Button variant="primary" onClick={handleSaveImage}>
            Save Changes
          </Button>
        </Modal.Footer>
      </Modal>
      <div className="container">
        <h1 className="text-center text-primary">Setting</h1>
        <Tabs
          id="tab"
          activeKey={key}
          onSelect={(k) => setKey(k)}
          className="mb-3"
        >
          <Tab eventKey="profile" title="Profile" className="d-flex">
            <div className="col-2 d-flex justify-content-center align-items-center flex-column">
              <img
                className="rounded-circle mb-4"
                style={{ boxShadow: "0px 0px 5px 1px rgba(0,0,0,0.5)" }}
                src={avatar !== null ? avatar : updateInfoUser.avatar}
                alt="Avatar"
                width={150}
                height={150}
              />
              <button
                className="btn btn-primary"
                disabled={!isUpdateProfile}
                onClick={handleShow}
              >
                Update avatar
              </button>
            </div>
            <div className="col-10 p-2">
              <div className="d-flex align-items-center gap-3 mb-3">
                <span className="col-2 text-center">Email</span>
                <FloatingLabel
                  controlId="iEmail"
                  label="Email"
                  className="flex-grow-1 col-10"
                >
                  <Form.Control
                    type="email"
                    placeholder="Email"
                    disabled
                    value={updateInfoUser.email}
                    onChange={(evt) => handleChangeInfo(evt, "email")}
                  />
                </FloatingLabel>
              </div>
              <div className="d-flex align-items-center gap-3 mb-3">
                <span className="col-2 text-center">Full name</span>
                <FloatingLabel
                  controlId="iFullName"
                  label="Full name"
                  className="flex-grow-1 col-10"
                >
                  <Form.Control
                    type="text"
                    placeholder="Full name"
                    disabled={!isUpdateProfile}
                    value={updateInfoUser.fullName}
                    onChange={(evt) => handleChangeInfo(evt, "fullName")}
                    isInvalid={!!errors.fullName}
                  />
                  <Form.Control.Feedback type="invalid">
                    {errors.fullName}
                  </Form.Control.Feedback>
                </FloatingLabel>
              </div>
              <div className="d-flex align-items-center gap-3 mb-3">
                <span className="col-2 text-center">Phone</span>
                <FloatingLabel
                  controlId="iPhone"
                  label="Phone"
                  className="flex-grow-1 col-10"
                >
                  <Form.Control
                    type="text"
                    placeholder="Phone"
                    disabled={!isUpdateProfile}
                    value={updateInfoUser.phone}
                    onChange={(evt) => handleChangeInfo(evt, "phone")}
                    isInvalid={!!errors.phone}
                  />
                  <Form.Control.Feedback type="invalid">
                    {errors.phone}
                  </Form.Control.Feedback>
                </FloatingLabel>
              </div>
              <div className="d-flex align-items-center gap-3 mb-3">
                <div className="ms-auto d-flex gap-2">
                  <button
                    className="btn btn-primary"
                    onClick={handleUpdateProfile}
                    disabled={isLoading}
                  >
                    Update
                  </button>
                  <button
                    className={isUpdateProfile ? "btn btn-danger" : "d-none"}
                    onClick={() => {
                      setIsUpdateProfile(false);
                      setUpdateInfoUser(user);
                      setAvatar(user.avatar);
                    }}
                  >
                    Cancel
                  </button>
                </div>
              </div>
            </div>
          </Tab>
          <Tab eventKey="post" title="Post"></Tab>
        </Tabs>
      </div>
    </>
  );
};

export default Setting;