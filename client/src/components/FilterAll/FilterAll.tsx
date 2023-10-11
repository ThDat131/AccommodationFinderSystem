import { Button, Form } from "react-bootstrap";
import {
  getDistrictsByProvinceCode,
  getProvinces,
  getWardsByDistrictCode,
} from "../../services/Apis";
import { useEffect, useState } from "react";
import { VNDCurrencyFormat } from "../../utils/Utils";

const FilterAll = ({ getParams }) => {
  const [provinces, setProvinces] = useState([]);
  const [districts, setDistricts] = useState([]);
  const [wards, setWards] = useState([]);

  const [selectedProvince, setSelectedProvince] = useState("");
  const [selectedDistrict, setSelectedDistrict] = useState("");
  const [selectedWard, setSelectedWard] = useState("");
  const [selectedPrice, setSelectedPrice] = useState("{}");
  const [selectedAcreage, setSelectedAcreage] = useState("{}");

  const handleSearch = () => {
    const provinceParam = { province: selectedProvince };
    const districtParam = { district: selectedDistrict };
    const wardParam = { ward: selectedWard };
    const priceParam = JSON.parse(selectedPrice)
    const acreageParam = JSON.parse(selectedAcreage);

    getParams(
      Object.assign(
        provinceParam,
        districtParam,
        wardParam,
        priceParam,
        acreageParam
      )
    );
  };

  const handleChangeProvince = (event: any) => {
    setSelectedProvince(event.target.value);
    setDistricts([]);
    setWards([]);
  };

  const handleChangeDistrict = (event: any) => {
    setSelectedDistrict(event.target.value);
    setWards([]);
  };

  const handleChangeWard = (event: any) => {
    setSelectedWard(event.target.value);
  };

  useEffect(() => {
    getProvinces(1).then((res) => {
      setProvinces(res.data);
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

  return (
    <div className="d-flex gap-2 mb-3 bg-warning p-2 rounded">
      <div className="flex-grow-1">
        <Form.Select onChange={handleChangeProvince}>
          <option>Tỉnh/Thành phố</option>
          {provinces.map((item: any, index: number) => {
            return (
              <option key={index} value={item.code}>
                {item.name}
              </option>
            );
          })}
        </Form.Select>
      </div>
      <div className="flex-grow-1">
        <Form.Select onChange={handleChangeDistrict}>
          <option>Quận/Huyện</option>
          {districts.map((item: any, index: number) => {
            return (
              <option key={index} value={item.code}>
                {item.name}
              </option>
            );
          })}
        </Form.Select>
      </div>
      <div className="flex-grow-1">
        <Form.Select onChange={handleChangeWard}>
          <option>Phường/Xã</option>
          {wards.map((item: any, index: number) => {
            return (
              <option key={index} value={item.code}>
                {item.name}
              </option>
            );
          })}
        </Form.Select>
      </div>
      <div className="flex-grow-1">
        <Form.Select
          value={selectedPrice}
          onChange={(evt: any) => setSelectedPrice(evt.target.value)}
        >
          <option value="{}">Giá</option>
          <option value='{"minPrice": 0, "maxPrice": 2000000}'>
            {" "}
            {VNDCurrencyFormat.format(0)} - {VNDCurrencyFormat.format(1000000)}
          </option>
          <option value='{"minPrice": 1000000, "maxPrice": 2000000}'>
            {VNDCurrencyFormat.format(1000000)} -{" "}
            {VNDCurrencyFormat.format(2000000)}
          </option>
          <option value='{"minPrice": 2000000, "maxPrice": 3000000}'>
            {VNDCurrencyFormat.format(2000000)} -{" "}
            {VNDCurrencyFormat.format(3000000)}
          </option>
          <option value='{"minPrice": 3000000, "maxPrice": 5000000}'>
            {VNDCurrencyFormat.format(3000000)} -{" "}
            {VNDCurrencyFormat.format(5000000)}
          </option>
          <option value='{"minPrice": 5000000, "maxPrice": 7000000}'>
            {VNDCurrencyFormat.format(5000000)} -{" "}
            {VNDCurrencyFormat.format(7000000)}
          </option>
          <option value='{"minPrice": 7000000, "maxPrice": 10000000}'>
            {VNDCurrencyFormat.format(7000000)} -{" "}
            {VNDCurrencyFormat.format(10000000)}
          </option>
          <option value='{"minPrice": 10000000, "maxPrice": 15000000}'>
            {VNDCurrencyFormat.format(10000000)} -{" "}
            {VNDCurrencyFormat.format(15000000)}
          </option>
          <option value='{"minPrice": 15000000}'>
            {">"}
            {VNDCurrencyFormat.format(15000000)}
          </option>
        </Form.Select>
      </div>
      <div className="flex-grow-1">
        <Form.Select
          value={selectedAcreage}
          onChange={(evt: any) => setSelectedAcreage(evt.target.value)}
        >
          <option value={"{}"}>Diện tích</option>
          <option value='{ "minAcreage": 0, "maxAcreage": 20 }'>
            &lt; 20m2
          </option>
          <option value='{ "minAcreage": 20, "maxAcreage": 30 }'>
            20m2 - 30m2
          </option>
          <option value='{ "minAcreage": 30, "maxAcreage": 50 }'>
            30m2 - 50m2
          </option>
          <option value='{ "minAcreage": 50, "maxAcreage": 70 }'>
            50m2 - 70m2
          </option>
          <option value='{ "minAcreage": 70, "maxAcreage": 90 }'>
            70m2 - 90m2
          </option>
          <option value='{ "minAcreage": 90}'>&gt; 90m2</option>
        </Form.Select>
      </div>

      <Button className="flex-grow-1" variant="primary" onClick={handleSearch}>
        Tìm kiếm
      </Button>
    </div>
  );
};

export default FilterAll;
