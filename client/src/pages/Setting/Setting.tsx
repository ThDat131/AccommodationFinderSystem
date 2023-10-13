import { useContext, useEffect, useRef, useState } from "react";
import { Button, FloatingLabel, Modal, Tab, Tabs } from "react-bootstrap";
import { Form } from "react-bootstrap";
import { MyUserContext } from "../../App";
import Avatar from "react-avatar-edit";
import { getCurrentUser, updateUser } from "../../services/Apis";
import { toast } from "react-toastify";
import cookie from "react-cookies";
import ImagePreview from "../../components/ImagePreview/ImagePreview";
import { createLandlord } from "../../services/AuthApis";

const urlToObject = async (image) => {
  const response = await fetch(image);
  const blob = await response.blob();
  const file = new File([blob], "image.png", { type: blob.type });
  return file;
};

const Setting = () => {
  const filesRef = useRef(null);
  const avatarFile = useRef(null);
  const [key, setKey] = useState("profile");
  const [isUpdateProfile, setIsUpdateProfile] = useState(false);
  const [user, dispatch] = useContext(MyUserContext);
  const [updateInfoUser, setUpdateInfoUser] = useState(null);
  const [showModalAvatar, setShowModalAvatar] = useState(false);
  const [avatar, setAvatar] = useState(null);
  const [errors, setErrors] = useState({
    fullName: "",
    phone: "",
    address: "",
    personalId: "",
  });
  const [isLoading, setIsLoading] = useState(false);
  const [imageUrls, setImageUrls] = useState<Array<string>>([]);
  const [address, setAddress] = useState<string>("");
  const [personalId, setPersonalId] = useState<string>("");
  const [disabled, setDisabled] = useState<boolean>(false);

  const handleClose = () => {
    setShowModalAvatar(false);
    setAvatar(user.avatar);
  };
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
  };

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
    } else formData.append("avatar", user.avatar);
    formData.append("phone", updateInfoUser.phone);

    updateUser(user._id, formData).then((res) => {
      if (res.status === 200) {
        toast.success("Update info successfully.");
        console.log(res.data);
        cookie.save("user", res.data, {});
        dispatch({
          type: "update_user",
          payload: res.data,
        });
        setIsUpdateProfile(false);
        setIsLoading(false);
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
    if (!image && !image.target.files[0].type.startsWith("image/")) {
      toast.error("Please input image file!");
      image.target.value = "";
      return;
    }
    if (image.target.files[0].size > 10000000) {
      toast.error("File is too big!");
      image.target.value = "";
    }
  };

  const onCrop = (value) => {
    urlToObject(value).then((res) => (avatarFile.current = res));
    setAvatar(value);
  };

  if (updateInfoUser === null) {
    return;
  }

  const handleChangeFiles = (evt: any) => {
    console.log(evt);
    if (evt.target.files) {
      setImageUrls([]);
      filesRef.current = [];
      for (const file of evt.target.files) {
        filesRef.current = [...filesRef.current, file];

        setImageUrls((prevImages) => [
          ...prevImages,
          URL.createObjectURL(file),
        ]);
      }
      console.log(filesRef);
    }
  };

  console.log(user);

  const handleDeleteImage = (index: number) => {
    const updatedImageUrls = [...imageUrls];
    updatedImageUrls.splice(index, 1);
    setImageUrls(updatedImageUrls);
    filesRef.current = updatedImageUrls;
    console.log(filesRef);
  };
  const validationUpgradeLandlord = (msgError: any) => {
    if (!address) msgError.address = "Vui lòng nhập địa chỉ";
    if (!personalId) {
      msgError.personalId = "Vui lòng nhập căn cước công dân";
    }
  };

  const handleUpgradeLandLord = () => {
    setDisabled(true);
    const msgError: any = {};
    validationUpgradeLandlord(msgError);
    if (Object.keys(msgError).length > 0) {
      setErrors(msgError);
      console.log(msgError);
      setDisabled(false);

      return;
    }

    const formData = new FormData();
    const data: any = {
      personalId: personalId,
      address: address,
      userId: user._id,
    };

    for (const field in data) {
      formData.append(field, data[field]);
    }
    if (filesRef.current && filesRef.current.length >= 3)
      for (let i = 0; i < filesRef.current.length; i++)
        formData.append("images", filesRef.current[i]);
    else {
      toast.error("Vui lòng thêm ít nhất 3 ảnh");
      setDisabled(false);

      return;
    }
    createLandlord(formData).then((res: any) => {
      if (res.status === 201) {
        getCurrentUser().then((res) => {
          if (res.status === 200) {
            toast.success(
              "Yêu cầu thành công, vui lòng chờ quản trị viên xét duyệt"
            );
            cookie.save("user", res.data, {});
            dispatch({
              type: "login",
              payload: res.data,
            });
          }
        });
      }
    });
  };
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
        <h1 className="text-center text-primary">Thông tin cá nhân</h1>
        <Tabs
          id="tab"
          activeKey={key}
          onSelect={(k) => setKey(k)}
          className="mb-3"
        >
          <Tab eventKey="profile" title="Profile">
            <div className="d-flex gap-5">
              <div className="col-2 d-flex align-items-center flex-column">
                <img
                  className="rounded-circle mb-4 mt-3"
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
                  Cập nhật ảnh
                </button>
              </div>
              <div className="col-10 p-2">
                <div className="d-flex align-items-center gap-3 mb-3">
                  <span className="col-2">Loại tài khoản</span>
                  {user.role === "ROLE_ADMIN" ||
                  user.role === "ROLE_SUPERADMIN" ? (
                    <p className="text-center text-danger m-0">Quản trị</p>
                  ) : user.landlordId === null ||
                    user.landlordId.active === false ? (
                    <p className="text-center text-danger m-0">Người dùng</p>
                  ) : (
                    <p className="text-center text-danger m-0">Chủ trọ</p>
                  )}

                  <div className="text-danger"></div>
                </div>
                <div className="d-flex align-items-center gap-3 mb-3">
                  <span className="col-2">Email</span>
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
                  <span className="col-2">Tên đầy đủ</span>
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
                  <span className="col-2">Số điện thoại</span>
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
                      Cập nhật
                    </button>
                    <button
                      className={isUpdateProfile ? "btn btn-danger" : "d-none"}
                      onClick={() => {
                        setIsUpdateProfile(false);
                        setUpdateInfoUser(user);
                        setAvatar(user.avatar);
                      }}
                    >
                      Huỷ
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </Tab>
          {user.role !== "ROLE_LANDLORD" && user.role !== "ROLE_ADMIN" ? (
            <Tab eventKey="post" title="Nâng cấp tài khoản chủ trọ">
              {user.landlordId === null ? (
                <>
                  <h2 className="text-primary mb-3">Nhập thông tin</h2>
                  <div className="col-8">
                    <FloatingLabel label="Địa chỉ" className="mb-3">
                      <Form.Control
                        type="text"
                        placeholder="Địa chỉ"
                        value={address}
                        onChange={(evt: any) => {
                          setAddress(evt.target.value);
                          setErrors((prevValue: any) => {
                            return {
                              ...prevValue,
                              address: "",
                            };
                          });
                        }}
                        isInvalid={!!errors.address}
                      />
                      <Form.Control.Feedback type="invalid">
                        {errors.address}
                      </Form.Control.Feedback>
                    </FloatingLabel>
                    <FloatingLabel label="Căn cước công dân" className="mb-3">
                      <Form.Control
                        type="text"
                        placeholder="Căn cước công dân"
                        value={personalId}
                        onChange={(evt: any) => {
                          setPersonalId(evt.target.value);
                          setErrors((prevValue: any) => {
                            return {
                              ...prevValue,
                              personalId: "",
                            };
                          });
                        }}
                        isInvalid={!!errors.personalId}
                      />
                      <Form.Control.Feedback type="invalid">
                        {errors.personalId}
                      </Form.Control.Feedback>
                    </FloatingLabel>
                    <div className="section-post-info mb-3">
                      <h3 className="text-primary">Hình ảnh nhà trọ</h3>
                      <div className="input-section mb-3">
                        <input
                          type="file"
                          name="files"
                          className="form-control"
                          id="post-images"
                          multiple
                          accept=".jpg, .jpeg, .png"
                          onChange={handleChangeFiles}
                        />
                        <label htmlFor="post-images" className="form-label">
                          <i className="fa-solid fa-upload"></i> &nbsp; Ảnh về
                          nhà trọ
                        </label>
                      </div>
                      <div className="images-preview d-flex align-items-center justify-content-start gap-2 flex-wrap">
                        {imageUrls && imageUrls.length > 0
                          ? imageUrls.map((image, index) => {
                              return (
                                <div
                                  className=""
                                  key={index}
                                  style={{ position: "relative" }}
                                >
                                  <ImagePreview sourceFile={image} />
                                  <button
                                    style={{
                                      position: "absolute",
                                      top: "10px",
                                      right: "10px",
                                    }}
                                    className="btn btn-danger rounded-circle"
                                    onClick={() => handleDeleteImage(index)}
                                  >
                                    <i className="fa-solid fa-xmark"></i>
                                  </button>
                                </div>
                              );
                            })
                          : ""}
                      </div>
                    </div>
                  </div>
                  <button
                    className="btn btn-primary"
                    onClick={handleUpgradeLandLord}
                    disabled={disabled}
                  >
                    Gửi yêu cầu
                  </button>
                </>
              ) : (
                <div className="d-flex align-items-center justify-content-center">
                  <h1 className="text-danger">
                    Đã gửi yêu cầu nâng cấp tài khoản chủ trọ
                  </h1>
                </div>
              )}
            </Tab>
          ) : (
            ""
          )}
        </Tabs>
      </div>
    </>
  );
};

export default Setting;
