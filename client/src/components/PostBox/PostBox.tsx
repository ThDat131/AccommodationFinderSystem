import { Link } from "react-router-dom";
import { VNDCurrencyFormat, decodeHtmlEntities } from "../../utils/Utils";
import { useEffect, useState } from "react";
import axios from "axios";

const PostBox = ({ data }) => {
  const [city, setCity] = useState<string>("");
  const [district, setDistrict] = useState<string>("");
  const fetchCity = async () => {
    await axios
      .get(`https://provinces.open-api.vn/api/p/${data.province}`)
      .then((res) => setCity(res.data.name))
      .catch((err) => console.log(err));
  };
  const fetchDistrict = async () => {
    await axios
      .get(`https://provinces.open-api.vn/api/d/${data.district}`)
      .then((res) => setDistrict(res.data.name))
      .catch((err) => console.log(err));
  };
  useEffect(() => {
    fetchCity();
    fetchDistrict();
  }, []);

  return (
    <div
      className="d-flex border-bottom border-secondary overflow-hidden my-3"
      style={{
        maxHeight: "250px",
      }}
    >
      <div className="col-4 p-3">
        <Link to={`/post/${data._id}`}>
          <img
            className="w-100 h-100 rounded"
            src={data.images[0]}
            alt=""
            style={{
              objectFit: "cover",
            }}
          />
        </Link>
      </div>
      <div className="col-8 p-1">
        <div className="my-2 overflow-hidden" style={{ height: "24px" }}>
          <h5>
            <Link className="text-dark" to={`/post/${data._id}`}>
              {data.name}
            </Link>
          </h5>
        </div>
        <div
          className="d-flex gap-2 my-2 overflow-hidden"
          style={{ height: "24px" }}
        >
          <p className="price text-success m-0">
            {VNDCurrencyFormat.format(data.price)} triệu/tháng
          </p>
          <p className="acreage m-0 text-dark">
            {data.acreage} m<sup>2</sup>
          </p>
          <p className="location m-0 text-dark">
            {/* {data.address.slice(data.address.indexOf("Quận"))} */}
            {district}, {city}
          </p>
        </div>
        <div
          className="my-2 overflow-hidden"
          style={{ height: "80px", lineHeight: "1.2" }}
        >
          <p className="text-dark">{decodeHtmlEntities(data.content)}</p>
        </div>
        <Link to={`/personal/${data.userId._id}`}>
          <div className="d-flex gap-2 align-items-center my-2">
            <img
              className="rounded rounded-circle"
              src={data.userId.avatar}
              alt=""
              width={40}
              height={40}
            />
            <p className="m-0 text-secondary">{data.userId.fullName}</p>
          </div>
        </Link>
      </div>
    </div>
  );
};

export default PostBox;
