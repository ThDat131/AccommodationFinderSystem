import { useEffect, useRef, useState } from "react";
import {
  ForwardGeocoding,
  getDistrictsByProvinceCode,
  getProvinces,
  getWardsByDistrictCode,
} from "../../services/Apis";
import { Spinner } from "react-bootstrap";
import { Editor } from "react-draft-wysiwyg";
import "react-draft-wysiwyg/dist/react-draft-wysiwyg.css";
import "./CreatePost.scss";
import ImagePreview from "../../components/ImagePreview/ImagePreview";
import Map from "../../components/Map/Map";

const CreatePost = () => {
  const [viewportData, setViewPortData] = useState({
    width: 400,
    height: 400,
    latitude: 10,
    longitude: 106,
    zoom: 0,
  });
  const filesRef = useRef(null);
  const [provinces, setProvinces] = useState([]);
  const [districts, setDistricts] = useState([]);
  const [wards, setWards] = useState([]);
  const [imageUrls, setImageUrls] = useState([]);

  const [selectedProvince, setSelectedProvince] = useState(null);
  const [selectedDistrict, setSelectedDistrict] = useState(null);
  const [_selectedWard, setSelectedWard] = useState(null);

  const [selectedProvinceName, setSelectedProvinceName] = useState<string>("");
  const [selectedDistrictName, setSelectedDistrictName] = useState<string>("");
  const [selectedWardName, setSelectedWardName] = useState<string>("");
  const [exactAddress, setExactAddress] = useState<string>("");

  const [isLoading, setIsLoading] = useState(true);
  const [street, setStreet] = useState<string>("");

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
                <select className="form-select">
                  <option defaultValue="">1</option>
                  <option defaultValue="">1</option>
                  <option defaultValue="">1</option>
                </select>
              </div>
              <div className="d-flex flex-column col-4">
                <h4>Name</h4>
                <input type="text" className="form-control" />
              </div>
              <div className="d-flex flex-column col-12">
                <h4>Content</h4>
                <Editor
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
      </div>
    </>
  );
};

export default CreatePost;
