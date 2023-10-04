const FilterAcreagePost = () => {
  return (
    <div className="p-3 w-100" style={{ backgroundColor: "#f5f5f5" }}>
      <h5>Xem theo diện tích</h5>
      <div className="my-2 justify-content-center">
        <div className="d-flex mb-2">
          <div className="col-6 px-3" style={{ cursor: "pointer" }}>
            <p className="m-0">
              <i className="fa-solid fa-angle-right"></i> Dưới 20 m<sup>2</sup>
            </p>
          </div>
          <div className="col-6 px-3" style={{ cursor: "pointer" }}>
            <p className="m-0">
              <i className="fa-solid fa-angle-right"></i> Từ 20 m<sup>2</sup> -
              30 m<sup>2</sup>
            </p>
          </div>
        </div>
        <div className="d-flex mb-2">
          <div className="col-6 px-3" style={{ cursor: "pointer" }}>
            <p className="m-0">
              <i className="fa-solid fa-angle-right"></i> Từ 30 m<sup>2</sup> -
              50 m<sup>2</sup>
            </p>
          </div>
          <div className="col-6 px-3" style={{ cursor: "pointer" }}>
            <p className="m-0">
              <i className="fa-solid fa-angle-right"></i> Từ 70 m<sup>2</sup> -
              90 m<sup>2</sup>
            </p>
          </div>
        </div>
        <div className="d-flex mb-2">
          <div className="col-6 px-3" style={{ cursor: "pointer" }}>
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
