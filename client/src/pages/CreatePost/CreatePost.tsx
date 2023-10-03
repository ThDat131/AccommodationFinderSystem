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
import { Post } from "../../interface/Post";
import draftToHtml from "draftjs-to-html";
import { MyUserContext } from "../../App";

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

  const [selectedProvince, setSelectedProvince] = useState(null);
  const [selectedDistrict, setSelectedDistrict] = useState(null);
  const [selectedWard, setSelectedWard] = useState(null);

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

  const [location, setLocation] = useState<any>({
    latitude: 0,
    longitude: 0,
  });

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
    // console.log(event.target.value)
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

  const handleCreatePost = () => {
    const data = {
      name: name,
      content: draftToHtml(convertToRaw(content.getCurrentContent())),
      price: price,
      acreage: acreage,
      longitude: location.longitude,
      latitude: location.latitude,
      address: exactAddress,
      provinceId: selectedProvince,
      districtId: selectedDistrict,
      wardId: selectedWard,
      userId: currentUser._id,
      categoryId: category,
    };
    const formData = new FormData();
    for(const field in data) {
      formData.append(field, data[field])
    }
    for (let i = 0; i < filesRef.current.length; i++) {
      formData.append("images", filesRef.current[i]);
    }
    // for (const pair of formData.entries()) {
    //   console.log(pair[0] + ", " + pair[1]);
    // }

    createPost(formData).then(res => {
      if (res.status === 201) {
        console.log(res.data)
      }
    })
  };

  useEffect(() => {
    getProvinces(1).then((res) => {
      setProvinces(res.data);
      setIsLoading(false);
    });
  }, []);

  useEffect(() => {
    if (selectedProvince !== null)
      getDistrictsByProvinceCode(selectedProvince, 2).then((res) => {
        setDistricts(res.data.districts);
      });
  }, [selectedProvince]);

  useEffect(() => {
    if (selectedDistrict !== null)
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
          Create new post
        </h2>
        <div className="d-flex justify-content-between">
          <div className="col-8 p-3">
            <div className="section-post-info mb-3">
              <h3 className="text-primary">Address for rent</h3>
              <div className="d-flex align-items-center gap-3 flex-wrap">
                <div className="d-flex flex-column col-3">
                  <h4>Province</h4>
                  <select
                    className="form-select"
                    onChange={handleChangeProvince}
                  >
                    <option defaultValue={null}>Select Province</option>
                    {provinces.map((item: any, index: number) => {
                      return (
                        <option key={index} value={item.code}>
                          {item.name}
                        </option>
                      );
                    })}
                  </select>
                </div>
                <div className="d-flex flex-column col-3">
                  <h4>District</h4>
                  <select
                    className="form-select"
                    onChange={handleChangeDistrict}
                  >
                    <option selected defaultValue={null}>
                      Select District
                    </option>
                    {districts.map((item: any, index: number) => {
                      return (
                        <option key={index} value={item.code}>
                          {item.name}
                        </option>
                      );
                    })}
                  </select>
                </div>
                <div className="d-flex flex-column col-3">
                  <h4>Ward</h4>
                  <select className="form-select" onChange={handleChangeWard}>
                    <option selected defaultValue={null}>
                      Select Ward
                    </option>
                    {wards.map((item: any, index: number) => {
                      return (
                        <option key={index} value={item.code}>
                          {item.name}
                        </option>
                      );
                    })}
                  </select>
                </div>
                <div className="d-flex flex-column col-3">
                  <h4>Street And House Number</h4>
                  <input
                    className="form-control"
                    type="text"
                    value={street}
                    onChange={(e) => {
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
                </div>
                <div className="d-flex flex-column col-12">
                  <h4>Exact Address</h4>
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
              <h3 className="text-primary">Description</h3>
              <div className="d-flex flex-column col-4">
                <h4>Category</h4>
                <select
                  className="form-select"
                  value={category}
                  onChange={(evt: any) => setCategory(evt.target.value)}
                >
                  <option value={null}>Select one category</option>
                  {categories.map((category: Category) => {
                    return (
                      <option key={category._id} value={category._id}>
                        {category.name}
                      </option>
                    );
                  })}
                </select>
              </div>
              <div className="d-flex flex-column col-4">
                <h4>Name</h4>
                <input
                  type="text"
                  className="form-control"
                  value={name}
                  onChange={(evt: any) => setName(evt.target.value)}
                />
              </div>
              <div className="d-flex flex-column col-12">
                <h4>Content</h4>
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
              <div className="d-flex flex-column col-4">
                <h4>Price</h4>
                <div className="input-group mb-3">
                  <input
                    type="number"
                    className="form-control"
                    placeholder="Selected price"
                    aria-describedby="price"
                    value={price}
                    onChange={(evt: any) => setPrice(evt.target.value)}
                  />
                  <span className="input-group-text" id="price">
                    VND / Month
                  </span>
                </div>
              </div>
              <div className="d-flex flex-column col-4">
                <h4>Acreage</h4>
                <div className="input-group mb-3">
                  <input
                    type="number"
                    className="form-control"
                    placeholder="Selected acreage"
                    aria-describedby="acreage"
                    value={acreage}
                    onChange={(evt: any) => setAcreage(evt.target.value)}
                  />
                  <span className="input-group-text" id="acreage">
                    m<sup>2</sup>
                  </span>
                </div>
              </div>
            </div>
            <div className="section-post-info mb-3">
              <h3 className="text-primary">Image</h3>
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
              <div className="images-preview d-flex align-items-center justify-content-center gap-2">
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
            <Map viewportData={viewportData} />
          </div>
        </div>
        <button className="btn-primary btn my-3" onClick={handleCreatePost}>
          Create Post
        </button>
      </div>
    </>
  );
};

export default CreatePost;
