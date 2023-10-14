import { useContext, useEffect, useRef, useState } from "react";
import {
  ForwardGeocoding,
  getDistrictsByProvinceCode,
  getProvinces,
  getWardsByDistrictCode,
} from "../../services/Apis";
import { Spinner } from "react-bootstrap";
import { Editor } from "react-draft-wysiwyg";
import { EditorState, convertToRaw } from "draft-js";
import "react-draft-wysiwyg/dist/react-draft-wysiwyg.css";
import "./CreatePost.scss";
import ImagePreview from "../../components/ImagePreview/ImagePreview";
import Map from "../../components/Map/Map";
import { FlyToInterpolator } from "@goongmaps/goong-map-react";
import { createPost, getCategories } from "../../services/AuthApis";
import { Category } from "../../interface/Category";
import draftToHtml from "draftjs-to-html";
import { MyUserContext } from "../../App";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";

const CreatePost = () => {
  const [viewportData, setViewPortData] = useState({
    width: 400,
    height: 400,
    latitude: 16.5552212,
    longitude: 105.2351686,
    zoom: 4,
    transitionDuration: 1000,
    transitionInterpolator: new FlyToInterpolator(),
  });
  const filesRef = useRef(null);
  const [provinces, setProvinces] = useState([]);
  const [districts, setDistricts] = useState([]);
  const [wards, setWards] = useState([]);
  const [imageUrls, setImageUrls] = useState([]);

  const [selectedProvince, setSelectedProvince] = useState("");
  const [selectedDistrict, setSelectedDistrict] = useState("");
  const [selectedWard, setSelectedWard] = useState("");

  const [selectedProvinceName, setSelectedProvinceName] = useState<string>("");
  const [selectedDistrictName, setSelectedDistrictName] = useState<string>("");
  const [selectedWardName, setSelectedWardName] = useState<string>("");
  const [exactAddress, setExactAddress] = useState<string>("");
  const [name, setName] = useState<string>("");
  const [category, setCategory] = useState<string>("");
  const [content, setContent] = useState<any>(EditorState.createEmpty());
  const [price, setPrice] = useState<number>(0);
  const [acreage, setAcreage] = useState<number>(0);
  const [isLoading, setIsLoading] = useState(true);
  const [street, setStreet] = useState<string>("");
  const [categories, setCategories] = useState<Array<Category>>([]);
  const [disabled, setDisabled] = useState<boolean>(false);
  const [errors, setErrors] = useState({
    province: "",
    district: "",
    ward: "",
    street: "",
    category: "",
    name: "",
    price: "",
    acreage: ""
  });
  const [location, setLocation] = useState<any>({
    latitude: 0,
    longitude: 0,
  });
  const nav = useNavigate()

  const [currentUser] = useContext(MyUserContext);

  const handleMoveMap = (address: string, type: string) => {
    ForwardGeocoding(address).then((res) => {
      setViewPortData({
        ...viewportData,
        zoom:
          type === "province"
            ? 8
            : type === "district"
            ? 12
            : type === "ward"
            ? 14
            : 16,
        latitude: res.data.results[0].geometry.location.lat,
        longitude: res.data.results[0].geometry.location.lng,
      });
      setLocation({
        latitude: res.data.results[0].geometry.location.lat,
        longitude: res.data.results[0].geometry.location.lng,
      });
    });
  };

  const handleDeleteImage = (index: number) => {
    const updatedImageUrls = [...imageUrls];
    updatedImageUrls.splice(index, 1);
    setImageUrls(updatedImageUrls);
    filesRef.current = updatedImageUrls;
    console.log(filesRef);
  };

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

  const handleChangeProvince = (event: any) => {
    setErrors((prevErrors) => ({
      ...prevErrors,
      province: "",
    }));
    console.log(event.target.value)
    // console.log(event.target[index].text)
    setSelectedProvince(event.target.value);
    setDistricts([]);
    setWards([]);
    const index = event.target.selectedIndex;
    setSelectedProvinceName(event.target[index].text);
    setSelectedDistrictName("");
    setSelectedWardName("");
    setStreet("");
    setExactAddress(event.target[index].text);
    handleMoveMap(event.target[index].text, "province");
  };

  const handleChangeDistrict = (event: any) => {
    setErrors((prevErrors) => ({
      ...prevErrors,
      district: "",
    }));
    setSelectedDistrict(event.target.value);
    setWards([]);
    const index = event.target.selectedIndex;
    setSelectedDistrictName(event.target[index].text);
    setSelectedWardName("");
    setStreet("");
    setExactAddress(event.target[index].text + ", " + selectedProvinceName);
    handleMoveMap(
      event.target[index].text + ", " + selectedProvinceName,
      "district"
    );
  };

  const handleChangeWard = (event: any) => {
    setErrors((prevErrors) => ({
      ...prevErrors,
      ward: "",
    }));
    setSelectedWard(event.target.value);
    const index = event.target.selectedIndex;
    setSelectedWardName(event.target[index].text);
    setStreet("");
    setExactAddress(
      event.target[index].text +
        ", " +
        selectedDistrictName +
        ", " +
        selectedProvinceName
    );
    handleMoveMap(
      event.target[index].text +
        ", " +
        selectedDistrictName +
        ", " +
        selectedProvinceName,
      "ward"
    );
  };

  const validation = (msgError: any) => {
    if (!selectedProvince) {
      msgError.province = "Vui lòng chọn thành phố/tỉnh!";
      if (!selectedDistrict) {
        msgError.district = "Vui lòng chọn quận/huyện!";
        if (!selectedWard) msgError.ward = "Vui lòng chọn phường/xã!";
      }
    }
    if (!street.trim())
      msgError.street = "Vui lòng nhập tên số nhà và tên đường!";
    if (!category) msgError.category = "Vui lòng chọn danh mục!";
    if (!name.trim()) msgError.name = "Vui lòng nhập tiêu đề!";
    if (!price) {
      msgError.price = "Vui lòng nhập giá cho thuê!";
      if (price <= 10000)
        msgError.price = "Vui lòng nhập giá cho thuê lớn hơn 10000";
    }
    if (!acreage) {
      msgError.acreage = "Vui lòng nhập diện tích!";
      if (acreage <= 0) msgError.acreage = "Vui lòng nhập diện tích lớn hơn 0";
    }
  };

  const handleCreatePost = () => {
    setDisabled(true);
    const msgError: any = {};
    validation(msgError);
    if (Object.keys(msgError).length > 0) {
      setErrors(msgError);
      setDisabled(false);
      console.log(msgError);
      return;
    }
    const data = {
      name: name,
      content: draftToHtml(convertToRaw(content.getCurrentContent())),
      price: price,
      acreage: acreage,
      longitude: location.longitude,
      latitude: location.latitude,
      address: exactAddress,
      province: selectedProvince,
      district: selectedDistrict,
      ward: selectedWard,
      userId: currentUser._id,
      categoryId: category,
    };
    const formData = new FormData();
    for (const field in data) {
      formData.append(field, data[field]);
    }
    if (filesRef.current && (filesRef.current.length >= 5 && filesRef.current.length <= 10)) 
      for (let i = 0; i < filesRef.current.length; i++) 
        formData.append("images", filesRef.current[i]);
    else {
      toast.error("Vui lòng thêm ít nhất 5 ảnh và tối đa 10 ảnh")
      setDisabled(false)
      return
    }
    // for (const pair of formData.entries()) {
    //   console.log(pair[0] + ", " + pair[1]);
    // }

    createPost(formData).then((res) => {
      if (res.status === 201) {
        toast.success("Thêm bài đăng thành công!")
        setDisabled(false)
        nav("/")
      }
    });
  };

  useEffect(() => {
    getProvinces(1).then((res) => {
      setProvinces(res.data);
      setIsLoading(false);
    });
  }, []);

  useEffect(() => {
    if (selectedProvince !== "")
      getDistrictsByProvinceCode(selectedProvince, 2).then((res) => {
        setDistricts(res.data.districts);
      });
  }, [selectedProvince]);

  useEffect(() => {
    if (selectedDistrict !== "")
      getWardsByDistrictCode(selectedDistrict, 2).then((res) => {
        setWards(res.data.wards);
      });
  }, [selectedDistrict]);

  useEffect(() => {
    getCategories().then((res) => {
      if (res.status === 200) {
        setCategories(res.data);
        setIsLoading(false);
      }
    });
  }, []);

  if (isLoading)
    return (
      <div className="d-flex align-items-center justify-content-center vh-100">
        <Spinner />
      </div>
    );

  return (
    <>
      <div className="container">
        <h2 className="text-primary border-bottom border-primary pb-2">
          Đăng tin cho thuê
        </h2>
        <div className="d-flex justify-content-between">
          <div className="col-8 p-3">
            <div className="section-post-info mb-3">
              <h3 className="text-primary mb-3">Địa chỉ cho thuê</h3>
              <div className="d-flex align-items-center gap-3 flex-wrap">
                <div className="d-flex flex-column col-4">
                  <h5>Tỉnh/Thành phố</h5>
                  <select
                    className="form-select"
                    onChange={handleChangeProvince}
                    value={selectedProvince}
                    required
                  >
                    <option value={""}>Chọn Tỉnh/Thành phố</option>
                    {provinces.map((item: any, index: number) => {
                      return (
                        <option key={index} value={item.code}>
                          {item.name}
                        </option>
                      );
                    })}
                  </select>
                  <div className="text-danger">{errors.province}</div>
                </div>
                <div className="d-flex flex-column col-4">
                  <h5>Quận/Huyện</h5>
                  <select
                    className="form-select"
                    onChange={handleChangeDistrict}
                    value={selectedDistrict}
                  >
                    <option value={""}>Chọn Quận/Huyện</option>
                    {districts.map((item: any, index: number) => {
                      return (
                        <option key={index} value={item.code}>
                          {item.name}
                        </option>
                      );
                    })}
                  </select>
                  <div className="text-danger">{errors.district}</div>
                </div>
                <div className="d-flex flex-column col-3">
                  <h5>Phường/Xã</h5>
                  <select
                    value={selectedWard}
                    className="form-select"
                    onChange={handleChangeWard}
                  >
                    <option value={""}>Chọn Phường/Xã</option>
                    {wards.map((item: any, index: number) => {
                      return (
                        <option key={index} value={item.code}>
                          {item.name}
                        </option>
                      );
                    })}
                  </select>
                  <div className="text-danger">{errors.ward}</div>
                </div>
                <div className="d-flex flex-column col-6">
                  <h5>Số nhà + Tên đường</h5>
                  <input
                    className="form-control"
                    type="text"
                    value={street}
                    onChange={(e) => {
                      setErrors((prevErrors) => ({
                        ...prevErrors,
                        street: "",
                      }));
                      setStreet(e.target.value);
                      setExactAddress(
                        e.target.value +
                          ", " +
                          selectedWardName +
                          ", " +
                          selectedDistrictName +
                          ", " +
                          selectedProvinceName
                      );
                    }}
                    onBlur={(e) => {
                      handleMoveMap(
                        e.target.value +
                          ", " +
                          selectedWardName +
                          ", " +
                          selectedDistrictName +
                          ", " +
                          selectedProvinceName,
                        "street"
                      );
                    }}
                  />
                  <div className="text-danger">{errors.street}</div>
                </div>
                <div className="d-flex flex-column col-12">
                  <h5>Địa chỉ chính xác</h5>
                  <input
                    className="form-control"
                    type="text"
                    readOnly={true}
                    value={exactAddress}
                  />
                </div>
              </div>
            </div>
            <div className="section-post-info mb-3">
              <h3 className="text-primary">Mô tả</h3>
              <div className="d-flex flex-column col-4 mt-3">
                <h5>Loại danh mục</h5>
                <select
                  className="form-select"
                  value={category}
                  onChange={(evt: any) => {
                    setErrors((prevErrors) => ({
                      ...prevErrors,
                      category: "",
                    }));
                    setCategory(evt.target.value);
                  }}
                >
                  <option value={""}>Chọn danh mục</option>
                  {categories.map((category: Category) => {
                    return (
                      <option key={category._id} value={category._id}>
                        {category.name}
                      </option>
                    );
                  })}
                </select>
                <div className="text-danger">{errors.category}</div>
              </div>
              <div className="d-flex flex-column col-4 mt-3">
                <h5>Tiêu đề</h5>
                <input
                  type="text"
                  className="form-control"
                  value={name}
                  onChange={(evt: any) => {
                    setErrors((prevErrors) => ({
                      ...prevErrors,
                      name: "",
                    }));
                    setName(evt.target.value);
                  }}
                />
                <div className="text-danger">{errors.name}</div>
              </div>
              <div className="d-flex flex-column col-12 mt-4">
                <h5>Nội dung miêu tả</h5>
                <Editor
                  editorState={content}
                  onEditorStateChange={(editorState) => setContent(editorState)}
                  editorStyle={{
                    height: "200px",
                    border: "0.2px solid #f3f3f3",
                    padding: "10px",
                  }}
                />
              </div>
              <div className="d-flex flex-column col-4 mt-3">
                <h5>Giá</h5>
                <div className="input-group mb-3">
                  <input
                    type="number"
                    className="form-control"
                    placeholder="Selected price"
                    aria-describedby="price"
                    value={price}
                    onChange={(evt: any) => {
                      setErrors((prevErrors) => ({
                        ...prevErrors,
                        price: "",
                      }));
                      setPrice(evt.target.value);
                    }}
                  />
                  <span className="input-group-text" id="price">
                    VND / Tháng
                  </span>
                </div>
                <div className="text-danger">{errors.price}</div>
              </div>
              <div className="d-flex flex-column col-4 mt-3">
                <h5>Diện tích</h5>
                <div className="input-group mb-3">
                  <input
                    type="number"
                    className="form-control"
                    placeholder="Selected acreage"
                    aria-describedby="acreage"
                    value={acreage}
                    onChange={(evt: any) => {
                      setErrors((prevErrors) => ({
                        ...prevErrors,
                        acreage: "",
                      }));
                      setAcreage(evt.target.value);
                    }}
                  />
                  <span className="input-group-text" id="acreage">
                    m<sup>2</sup>
                  </span>
                </div>
                <div className="text-danger">{errors.acreage}</div>
              </div>
            </div>
            <div className="section-post-info mb-3">
              <h3 className="text-primary">Hình ảnh</h3>
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
                  <i className="fa-solid fa-upload"></i> &nbsp; Ảnh bài đăng
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

          <div className="col-4 p-3">
            <Map viewportData={viewportData} layer={false}/>
          </div>
        </div>
        <button className="btn-primary btn my-3" onClick={handleCreatePost} disabled={disabled}>
          Tại bài đăng
         </button>
      </div>
    </>
  );
};

export default CreatePost;
