const FilterAcreagePost = ({ getParams }) => {
  return (
    <div className="p-3 w-100" style={{ backgroundColor: "#f5f5f5" }}>
      <h5>Xem theo diện tích</h5>
      <div className="my-2 justify-content-center">
        <div className="d-flex mb-2">
          <div
            className="col-6 px-3"
            style={{ cursor: "pointer" }}
            onClick={() => getParams({ minAcreage: 0, maxAcreage: 20 })}
          >
            <p className="m-0">
              <i className="fa-solid fa-angle-right"></i> Dưới 20 m<sup>2</sup>
            </p>
          </div>
          <div
            className="col-6 px-3"
            style={{ cursor: "pointer" }}
            onClick={() => getParams({ minAcreage: 20, maxAcreage: 30 })}
          >
            <p className="m-0">
              <i className="fa-solid fa-angle-right"></i> Từ 20 m<sup>2</sup> -
              30 m<sup>2</sup>
            </p>
          </div>
        </div>
        <div className="d-flex mb-2">
          <div
            className="col-6 px-3"
            style={{ cursor: "pointer" }}
            onClick={() => getParams({ minAcreage: 30, maxAcreage: 50 })}
          >
            <p className="m-0">
              <i className="fa-solid fa-angle-right"></i> Từ 30 m<sup>2</sup> -
              50 m<sup>2</sup>
            </p>
          </div>
          <div
            className="col-6 px-3"
            style={{ cursor: "pointer" }}
            onClick={() => getParams({ minAcreage: 50, maxAcreage: 70 })}
          >
            <p className="m-0">
              <i className="fa-solid fa-angle-right"></i> Từ 50 m<sup>2</sup> -
              70 m<sup>2</sup>
            </p>
          </div>
        </div>
        <div className="d-flex mb-2">
          <div
            className="col-6 px-3"
            style={{ cursor: "pointer" }}
            onClick={() => getParams({ minAcreage: 70, maxAcreage: 90 })}
          >
            <p className="m-0">
              <i className="fa-solid fa-angle-right"></i> Từ 70 m<sup>2</sup> -
              90 m<sup>2</sup>
            </p>
          </div>
          <div
            className="col-6 px-3"
            style={{ cursor: "pointer" }}
            onClick={() => getParams({ minAcreage: 90 })}
          >
            <p className="m-0">
              <i className="fa-solid fa-angle-right"></i> Trên 90 m<sup>2</sup>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FilterAcreagePost;
