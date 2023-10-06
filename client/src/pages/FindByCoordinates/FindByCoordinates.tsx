import { FlyToInterpolator } from "@goongmaps/goong-map-react";
import { useState } from "react";
import Map from "../../components/Map/Map";
import { FloatingLabel, Form } from "react-bootstrap";
import { PlaceSearch, getPlaceDetailById } from "../../services/Apis";

const FindByCoordinates = () => {
  const [viewportData, setViewPortData] = useState({
    width: "100%",
    height: 400,
    latitude: 20.5552212,
    longitude: 105.2351686,
    zoom: 4,
    transitionDuration: 1000,
    transitionInterpolator: new FlyToInterpolator(),
  });

  const [address, setAddress] = useState<string>("");
  const [addressData, setAddressData] = useState<Array<any>>([]);

  const handleChangeAddress = (evt: any) => {
    setAddress(evt.target.value);
    setAddressData([]);
  };

  const handleSearch = () => {
    setAddressData([]);
    PlaceSearch(address).then((res) => {
      if (res.status === 200) {
        setAddressData(res.data.predictions);
        console.log(res.data.predictions);
      }
    });
  };

  const handleSelect = (data: any) => {
    getPlaceDetailById(data.place_id).then((res: any) => {
      if (res.status === 200) {
        setViewPortData((prevValue: any) => {
          return {
            ...prevValue,
            latitude: res.data.result.geometry.location.lat,
            longitude: res.data.result.geometry.location.lng,
            zoom: 15,
          };
        });
        setAddressData([]);
        console.log(res.data)

      }
    });
  };
  return (
    <>
      <div className="container">
        <h2 className="text-primary border-bottom border-primary pb-2">
          Tìm nhà trọ theo toạ độ
        </h2>
        <div className="d-flex">
          <div className="col-8 col-md-8 col-xs-8 col-lg-8">
            <Map viewportData={viewportData} />
          </div>
          <div className="col-4 col-md-4 col-xs-4 col-lg-4 p-3">
            <FloatingLabel
              label="Nhập địa điểm"
              className="mb-3 position-relative"
            >
              <Form.Control
                type="text"
                placeholder="Địa điểm"
                value={address}
                onChange={handleChangeAddress}
                onKeyDown={(evt: any) => {
                  if (evt.key === "Enter") handleSearch();
                }}
              />
              <ul
                className="list-group position-absolute mt-3 w-100"
                style={{ cursor: "pointer" }}
              >
                {addressData.map((data: any, index: number) => {
                  return (
                    <>
                      <li
                        className="list-group-item"
                        key={index}
                        onClick={() => handleSelect(data)}
                      >
                        <div className="d-flex flex-wrap">
                          <div className="px-3 z-1">
                            {data.description.slice(
                              0,
                              data.description.indexOf(", ")
                            )}
                          </div>
                          <div className="px-3 z-1">
                            {data.description.slice(
                              data.description.indexOf(",") + 1
                            )}
                          </div>
                        </div>
                      </li>
                    </>
                  );
                })}
              </ul>
            </FloatingLabel>
          </div>
        </div>
      </div>
    </>
  );
};

export default FindByCoordinates;
