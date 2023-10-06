import { useContext, useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import Map from "../../components/Map/Map";
import { MyUserContext } from "../../App";
import { toast } from "react-toastify";
import { useRef } from "react";
import cookie from "react-cookies";
import { getDetailPost } from "../../services/Apis";
import { Spinner } from "react-bootstrap";
import { VNDCurrencyFormat } from "../../utils/Utils";
import DOMPurify from "dompurify";

const DetailPost = () => {
  const [user, dispatch] = useContext(MyUserContext);
  const { id } = useParams();
  const [detailPost, setDetailPost] = useState(null);
  const [imgPos, setImgPos] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [comment, setComment] = useState("");
  const [listFollow, setListFollow] = useState([]);
  const [isFollow, setIsFollow] = useState(null);
  const [viewportData, setViewPortData] = useState({
    width: "100%",
    height: 400,
    latitude: 16.5552212,
    longitude: 105.2351686,
    zoom: 16,
  });

  // const htmlFormatted = DOMPurify.sanitize(detailPost.content, {
  //     USE_PROFILES: { html: true },
  // });

  const clickNext = () => {
    setImgPos((prevImgPos) => (prevImgPos + 1) % detailPost.images.length);
  };
  const clickPrev = () => {
    setImgPos(
      (prevImgPos) =>
        (prevImgPos - 1 + detailPost.images.length) % detailPost.images.length
    );
  };

  useEffect(() => {
    getDetailPost(id).then((res) => {
      if (res.status === 200) {
        console.log(res.data);
        setDetailPost(res.data);
        setViewPortData((prevValue) => {
          return {
            ...prevValue,
            latitude: res.data.latitude,
            longitude: res.data.longitude,
          };
        });
        setIsLoading(false);
      }
    });
  }, []);

  //   useEffect(() => {
  //     if (user !== null) {
  //       if (user.role === -1) {
  //         setListFollow(user.tentant.followSet);
  //       }
  //     }
  //   }, [user]);

  //   useEffect(() => {
  //     if (listFollow && detailPost) {
  //       const isFollowing = listFollow.some(
  //         (follow) => follow.landLordId.id === detailPost.username.landLord.id
  //       );
  //       setIsFollow(isFollowing);
  //     }
  //   }, [listFollow, detailPost]);

  if (isLoading)
    return (
      <div className="d-flex align-items-center justify-content-center vh-100">
        <Spinner />
      </div>
    );
  return (
    <>
      <div className="container">
        <h1 className="text-center text-info my-3">Thông tin chi tiết</h1>
        <div className="carousel slide my-3" data-bs-ride="carousel">
          <div className="carousel-inner">
            {detailPost.images.map((img, index) => (
              <div
                className={`carousel-item ${index === imgPos ? "active" : ""}`}
                key={index}
              >
                <img
                  src={img}
                  className="d-block w-100"
                  alt=""
                  style={{ objectFit: "cover", width: "100%", height: "300px" }}
                />
              </div>
            ))}
          </div>
          <button
            className="carousel-control-prev"
            type="button"
            data-bs-slide="prev"
            onClick={clickPrev}
          >
            <span
              className="carousel-control-prev-icon"
              aria-hidden="true"
            ></span>
            <span className="visually-hidden">Previous</span>
          </button>
          <button
            className="carousel-control-next"
            type="button"
            data-bs-slide="next"
            onClick={clickNext}
          >
            <span
              className="carousel-control-next-icon"
              aria-hidden="true"
            ></span>
            <span className="visually-hidden">Next</span>
          </button>
        </div>
        <Link to={`/personal/${detailPost.userId._id}`}>
          <div
            className="d-flex align-items-center gap-3 my-3"
            style={{ cursor: "pointer" }}
          >
            <div className="d-flex align-items-center gap-3">
              <img
                className="rounded-circle"
                src={detailPost.userId.avatar}
                alt=""
                width={40}
                height={40}
              />
              <p className="m-0 text-dark">
                {detailPost.userId.fullName}
              </p>
            </div>
            {/* <button type="button" className="btn btn-info" onClick={handleFollow}>Theo dõi</button> */}
            {user !== null && user.role === -1 ? (
              isFollow ? (
                <>
                  <button type="button" className="btn btn-success">
                    Đã theo dõi
                  </button>
                  <button type="button" className="btn btn-danger">
                    Huỷ theo dõi
                  </button>
                </>
              ) : (
                <button type="button" className="btn btn-success">
                  Theo dõi
                </button>
              )
            ) : (
              ""
            )}
          </div>
        </Link>

        <h3 className="text-danger my-2">{detailPost.name}</h3>
        <p>Địa chỉ: {detailPost.address}</p>
        <div className="room-info-post d-flex gap-3 align-items-center mb-2">
          <div className="price">
            <h4 className="text-success" style={{ margin: "0" }}>
              {VNDCurrencyFormat.format(detailPost.price)}/tháng
            </h4>
          </div>
          <div className="acreage">
            <p style={{ margin: "0" }}>
              {detailPost.acreage} m<sup>2</sup>
            </p>
          </div>
          <div>
            <p style={{ margin: "0" }}>
              Ngày đăng bài: {new Date(detailPost.createdAt).getDate()}/
              {new Date(detailPost.createdAt).getMonth() + 1}/
              {new Date(detailPost.createdAt).getFullYear()}
            </p>
          </div>
        </div>
        <div>
          <h3 className="my-2">Thông tin mô tả</h3>
          <div
            dangerouslySetInnerHTML={{
              __html: DOMPurify.sanitize(detailPost.content, {
                USE_PROFILES: { html: true },
              }),
            }}
          ></div>
        </div>
        <div>
          <h3 className="my-2">Vị trí</h3>
          <div className="w-100 h-100 my-3">
            <Map viewportData={viewportData} />
          </div>
        </div>
        <div>
          <h3 className="my-2">Bình luận</h3>
          <div className="row d-flex justify-content-start my-3">
            <div className="col-md-12 col-lg-10 col-xl-8">
              <div className="d-flex flex-start w-100">
                {user === null ? (
                  <img
                    className="rounded-circle shadow-1-strong me-3"
                    src="https://upload.wikimedia.org/wikipedia/commons/thumb/8/8e/Font_Awesome_5_solid_user.svg/1792px-Font_Awesome_5_solid_user.svg.png"
                    alt="avatar"
                    width="40"
                    height="40"
                  />
                ) : (
                  <img
                    className="rounded-circle shadow-1-strong me-3"
                    src={user.avatar}
                    alt="avatar"
                    width="40"
                    height="40"
                  />
                )}

                <div className="form-floating w-100">
                  <textarea
                    className="form-control"
                    placeholder="Leave a comment here"
                    id="floatingTextarea"
                    onChange={(e) => setComment(e.target.value)}
                    value={comment}
                  ></textarea>
                  <label htmlFor="floatingTextarea">
                    Đánh giá về nhà trọ ở đây
                  </label>
                </div>
              </div>
              <div className="float-end mt-2 pt-1">
                <button type="button" className="btn btn-primary btn">
                  Bình luận
                </button>
              </div>
            </div>
          </div>
          {/* <div className="d-flex flex-start my-3 flex-wrap">
            {listComment.length >= 1 ? (
              listComment.map((comment, index) => {
                return <Comment key={index} comment={comment} />;
              })
            ) : (
              <div className="alert alert-danger">Chưa có bình luận</div>
            )}
          </div> */}
        </div>
      </div>
    </>
  );
};

export default DetailPost;
