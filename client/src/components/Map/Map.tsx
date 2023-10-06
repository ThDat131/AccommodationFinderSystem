import ReactMapGL, {
  Layer,
  Marker,
  Source,
} from "@goongmaps/goong-map-react";
import "@goongmaps/goong-js/dist/goong-js.css";
import { useEffect, useState } from "react";
const Map = ({ viewportData }) => {
  const MapAPIKey = import.meta.env.VITE_GOONG_MAPTILES_KEY;
  const [viewport, setViewPort] = useState({
    latitude: 10,
    longitude: 106,
    zoom: 0,
  });

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
          coordinates: [
            [
              [viewportData.longitude, viewportData.latitude],
            ],
          ],
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
      <Marker
        latitude={viewportData.latitude}
        longitude={viewportData.longitude}
      >
        <div>
          <i className="fa-solid fa-location-dot" style={{ color: "#000" }}></i>
        </div>
      </Marker>
      <Source type="geojson" data={geojson}>
        <Layer
          id="point"
          type="circle"
          paint={{
            "circle-radius": 100,
            "circle-color": "#FF0000",
            "circle-opacity": 0.2
          }}
        />
      </Source>
    </ReactMapGL>
  );
};

export default Map;
