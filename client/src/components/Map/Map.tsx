import ReactMapGL, { Marker } from "@goongmaps/goong-map-react";
import "@goongmaps/goong-js/dist/goong-js.css";
import { useEffect, useState } from "react";
const Map = ({ viewportData }) => {
  const MapAPIKey = import.meta.env.VITE_GOONG_MAPTILES_KEY;
  const [viewport, setViewPort] = useState({
    latitude: 10,
    longitude: 106,
    zoom: 0,
  });
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
      <Marker
        latitude={viewportData.latitude}
        longitude={viewportData.longitude}
      >
        <div>
          <i className="fa-solid fa-location-dot" style={{ color: "#000" }}></i>
        </div>
      </Marker>
    </ReactMapGL>
  );
};

export default Map;
