import { useContext, useEffect, useRef, useState } from "react";
import { Button, FloatingLabel, Modal, Tab, Tabs } from "react-bootstrap";
import { Form } from "react-bootstrap";
import { MyUserContext } from "../../App";
import Avatar from "react-avatar-edit"

const Setting = () => {

  // const avatar = useRef(null)
  const [key, setKey] = useState("profile");
  const [isUpdateProfile, setIsUpdateProfile] = useState(false);
  const [user, _dispatch] = useContext(MyUserContext);
  const [updateInfoUser, setUpdateInfoUser] = useState(null);
  const [showModalAvatar, setShowModalAvatar] = useState(false);
  const [avatar, setAvatar] = useState(null)

  const handleClose = () => setShowModalAvatar(false);
  const handleShow = () => setShowModalAvatar(true);
  const handleSaveImage = () => {

  }

  useEffect(() => {
    setUpdateInfoUser(user);
    // setAvatar(user.avatar)
  }, [user]);

  const handleUpdateProfile = () => {
    setIsUpdateProfile(true);
    console.log(updateInfoUser);
  };

  const handleChangeInfo = (evt, field) => {
    setUpdateInfoUser((current) => {
      return { ...current, [field]: evt.target.value };
    });
  };

  const onBeforeFileLoad = (image) => {
    if (image.target.files[0].size > 100000) {
      alert("File is too big!");
      image.target.value = "";
    }
  }

  const onCrop = (value) => {
    setAvatar(value)
  }

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
                  />
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
                  />
                </FloatingLabel>
              </div>
              <div className="d-flex align-items-center gap-3 mb-3">
                <div className="ms-auto d-flex gap-2">
                  <button
                    className="btn btn-primary"
                    onClick={handleUpdateProfile}
                  >
                    Update
                  </button>
                  <button
                    className={isUpdateProfile ? "btn btn-danger" : "d-none"}
                    onClick={() => {
                      setIsUpdateProfile(false);
                      setUpdateInfoUser(user);
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
