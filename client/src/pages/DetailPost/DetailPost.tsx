import { useContext, useEffect, useRef, useState } from "react";
import { Link, useParams } from "react-router-dom";
import Map from "../../components/Map/Map";
import { MyUserContext } from "../../App";
import { getCommentByPost, getDetailPost } from "../../services/Apis";
import { Spinner } from "react-bootstrap";
import { VNDCurrencyFormat } from "../../utils/Utils";
import DOMPurify from "dompurify";
import { createComment } from "../../services/AuthApis";
import { toast } from "react-toastify";
import Comment from "../../components/Comment/Comment";
import { IComment } from "../../interface/IComment";
import { socket } from "../../configs/socket";

const DetailPost = () => {
  const [user, _dispatch] = useContext(MyUserContext);
  const { id } = useParams();
  const [detailPost, setDetailPost] = useState(null);
  const [imgPos, setImgPos] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [comment, setComment] = useState<string>("");
  const [comments, setComments] = useState<Array<IComment>>([]);
  const [disabled, setDisabled] = useState<boolean>(false);
  const [status, setStatus] = useState(false);

  // socket.on("receive_comment", async (data) => {
  //   setComments([...comments, data]);
  // });
  // socket.on("reply_comment", async (data: any) => {
  //   setComments((prevComments) => {
  //     return prevComments.map((comment: IComment) => {
  //       return comment._id === data._id ? data : comment;
  //     });
  //   });
  // });
  // socket.on("edit_comment", async (data: any) => {
  //   setComments((prevComments) => {
  //     return prevComments.map((comment: IComment) => {
  //       return comment._id === data._id ? data : comment;
  //     });
  //   });
  // });
  // socket.on("delete_comment", async (data: any) => {
  //   setComments((prevComments) => {
  //     return prevComments.filter((comment) => comment._id !== data);
  //   });
  // });
  // socket.on("delete_reply", async (data: any) => {
  //   setComments((prevComments) => {
  //     return prevComments.map((comment: IComment) => {
  //       return comment._id === data._id ? data : comment;
  //     });
  //   });
  // });

  const [trigger, setTrigger] = useState("");

  const addComment = (newComment) => {
    setComments((prevComments) => [...prevComments, newComment]);
  };

  const editComment = (editedComment) => {
    setComments((prevComments) => {
      return prevComments.map((comment) =>
        comment._id === editedComment._id ? editedComment : comment
      );
    });
  };
  const deleteComment = (commentId) => {
    setComments((prevComments) =>
      prevComments.filter((comment) => comment._id !== commentId)
    );
  };

  useEffect(() => {
    socket.on("receive_reply_comment", (data) => {
      console.log(data);
      editComment(data);
    });
    socket.on("receive_comment", (data) => {
      addComment(data);
      console.log(data)
    });
    socket.on("receive_edit_comment", (data) => {
      editComment(data);
    });

    socket.on("receive_delete_comment", (data) => {
      deleteComment(data);
    });

    socket.on("receive_delete_reply", (data) => {
      editComment(data);
    });

    const deleteComment = (commentId) => {
      setComments((prevComments) =>
        prevComments.filter((comment) => comment._id !== commentId)
      );
    };
    return () => {
      socket.off("receive_comment");
      socket.off("receive_reply_comment");
      socket.off("receive_edit_comment");
      socket.off("receive_delete_comment");
      socket.off("receive_delete_reply");
    };
  }, [trigger]);

  const [viewportData, setViewPortData] = useState({
    width: "100%",
    height: 400,
    latitude: 16.5552212,
    longitude: 105.2351686,
    zoom: 16,
  });

  const clickNext = () => {
    setImgPos((prevImgPos) => (prevImgPos + 1) % detailPost.images.length);
  };
  const clickPrev = () => {
    setImgPos(
      (prevImgPos) =>
        (prevImgPos - 1 + detailPost.images.length) % detailPost.images.length
    );
  };

  const handleComment = () => {
    setStatus(true);
    if (!comment) {
      toast.error("Vui lòng nhập bình luận!");
      return;
    }
    setDisabled(true);
    createComment({
      content: comment,
      postId: id,
      userId: user._id,
    }).then((res: any) => {
      if (res.status === 201) {
        socket.emit("send_comment", res.data);
        setComment("");
      }
    });
  };

  useEffect(() => {
    getCommentByPost(id).then((res: any) => {
      if (res.status === 200) {
        setComments(res.data);
      }
    });
    getDetailPost(id).then((res) => {
      if (res.status === 200) {
        // console.log(res.data);
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
                  style={{ objectFit: "cover", width: "100%", height: "500px" }}
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
        <div className="row">
          <div className="col-6">
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
                  <p className="m-0 text-dark">{detailPost.userId.fullName}</p>
                </div>
              </div>
            </Link>

            <h3 className="text-danger my-2">{detailPost.name}</h3>
            <div className="my-2">
              <p>Danh mục: {detailPost.categoryId.name}</p>
            </div>
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
          </div>

          <div className="col-6">
            <h3 className="my-2">Vị trí</h3>
            <div className="w-100 my-3">
              <Map viewportData={viewportData} layer={false} />
            </div>
          </div>
        </div>

        <div className="w-100">
          <h3 className="my-2">Bình luận</h3>
          {!user ? (
            <div className="alert alert-danger">
              Vui lòng đăng nhập để bình luận{" "}
              <Link to={"/signin"}>Đăng nhập</Link>
            </div>
          ) : (
            <div className="d-flex justify-content-start my-3">
              <div className="w-100">
                <div className="d-flex flex-start w-100">
                  <img
                    className="rounded-circle shadow-1-strong me-3"
                    src={user.avatar}
                    alt="avatar"
                    width="60"
                    height="60"
                  />

                  <div className="form-floating w-100">
                    <textarea
                      className="form-control"
                      placeholder="Leave a comment here"
                      id="floatingTextarea"
                      onChange={(e) => setComment(e.target.value)}
                      value={comment}
                    ></textarea>
                    <label htmlFor="floatingTextarea">
                      Bình luận về nhà trọ ở đây
                    </label>
                  </div>
                </div>
                <div className="float-end mt-2 pt-1">
                  <button
                    type="button"
                    className="btn btn-primary btn"
                    onClick={handleComment}
                  >
                    Bình luận
                  </button>
                </div>
              </div>
            </div>
          )}

          <div className="d-flex flex-start my-3 flex-wrap">
            {comments.length >= 1 ? (
              comments.map((comment) => {
                if (!comment.commentId) {
                  return (
                    <Comment
                      key={comment._id}
                      comment={comment}
                      setTrigger={setTrigger}
                    />
                  );
                }
              })
            ) : (
              <div className="alert alert-danger">Chưa có bình luận</div>
            )}
          </div>
        </div>
      </div>
    </>
  );
};

export default DetailPost;
