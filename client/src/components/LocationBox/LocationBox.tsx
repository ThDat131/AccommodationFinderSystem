
const LocationBox = ({ category, image, locationName }) => {
  return (
    <div
      className="d-flex flex-column justify-content-center rounded overflow-hidden hover"
      style={{
        boxShadow: "1px 1px 9px 2px rgba(0, 0, 0, 0.5)",
        width: "250px",
        cursor: "pointer",
      }}
    >
      <div
        style={{
          backgroundImage: `url(${image})`,
          backgroundPosition: "center",
          minHeight: "100px",
          backgroundSize: "cover",
        }}
      ></div>
      <div className="d-inline-block">
        <p
          className="text-primary m-0 p-3 fw-bold text-center"
          style={{
            whiteSpace: "nowrap",
            overflow: "hidden",
            textOverflow: "ellipsis",
          }}
        >
          {category.name} {locationName}
        </p>
      </div>
    </div>
  );
};
export default LocationBox;
