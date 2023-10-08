import ReactMapGL, {
  Layer,
  Marker,
  Popup,
  Source,
} from "@goongmaps/goong-map-react";
import "@goongmaps/goong-js/dist/goong-js.css";
import { useEffect, useState } from "react";
const Map = ({ viewportData, layer, markers }) => {
  const MapAPIKey = import.meta.env.VITE_GOONG_MAPTILES_KEY;
  const [viewport, setViewPort] = useState({
    latitude: 10,
    longitude: 106,
    zoom: 0,
  });
  const [popups, setPopups] = useState([]);

  const geojson = {
    type: "FeatureCollection",
    features: [
      {
        type: "Feature",
        geometry: {
          type: "Point",
          coordinates: [viewportData.longitude, viewportData.latitude],
        },
      },
      {
        type: "Feature",
        geometry: {
          type: "Polygon",
          coordinates: [[[viewportData.longitude, viewportData.latitude]]],
        },
      },
    ],
  };
  useEffect(() => {
    setViewPort(viewportData);
  }, [viewportData]);
  return (
    <ReactMapGL
      {...viewport}
      onViewportChange={(nextViewPort: any) => {
        setViewPort(nextViewPort);
      }}
      goongApiAccessToken={MapAPIKey}
    >
      {markers && markers.length > 0
        ? markers.map((marker: any) => {
            return (
              <Marker latitude={marker.latitude} longitude={marker.longitude}>
                <div
                  onClick={() => setPopups([...popups, marker])}
                  style={{ cursor: "pointer" }}
                >
                  <i
                    className="fa-solid fa-location-dot"
                    style={{ color: "#00FF00" }}
                  ></i>
                </div>
              </Marker>
            );
          })
        : ""}
      {popups && popups.length > 0
        ? popups.map((popup: any) => {
            return (
              <Popup
                latitude={popup.latitude}
                longitude={popup.longitude}
                onClose={() =>
                  setPopups(
                    popups.filter((pop) => {
                      pop._id !== popup._id;
                    })
                  )
                }
              >
                <div className="d-flex flex-column">
                  <p>{popup.name}</p>
                  <div className="img" style={{ width: "200px" }}>
                    <img className="w-100" src={popup.images[0]} alt="" />
                  </div>
                </div>
              </Popup>
            );
          })
        : ""}
      <Marker
        latitude={viewportData.latitude}
        longitude={viewportData.longitude}
      >
        <div>
          <i className="fa-solid fa-location-dot" style={{ color: "#000" }}></i>
        </div>
      </Marker>
      {layer ? (
        <Source type="geojson" data={geojson}>
          <Layer
            id="point"
            type="circle"
            paint={{
              "circle-radius": 200,
              "circle-color": "#FF0000",
              "circle-opacity": 0.2,
            }}
          />
        </Source>
      ) : (
        ""
      )}
    </ReactMapGL>
  );
};

export default Map;
