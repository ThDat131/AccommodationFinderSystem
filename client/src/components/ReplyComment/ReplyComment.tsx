import { useContext, useEffect, useState } from "react";
import { deleteReplyComment, editReplyComment } from "../../services/AuthApis";
import { io } from "socket.io-client";
import { toast } from "react-toastify";
import { MyUserContext } from "../../App";

const ReplyComment = ({ reply, commentId }) => {
  const [isEditReply, setIsEditReply] = useState<boolean>(false);
  const [editedReply, setEditedReply] = useState<string>("");
  const socket = io("http://localhost:8085", { transports: ["websocket"] });
  const [user, _dispatch] = useContext(MyUserContext);

  const handleChangeReplyComment = () => {
    editReplyComment(commentId, reply._id, {
      contentReply: editedReply,
      userId: reply.userId._id,
    }).then((res: any) => {
      if (res.status === 200) {
        socket.timeout(1000).emit("edit_comment", res.data);
        setIsEditReply(false);
      }
    });
  };

  const handleDeleteReply = (commentId, replyId) => {
    confirm("Bạn có chắc chắn muốn xoá không?");
    if (!confirm) return;
    deleteReplyComment(commentId, replyId, {
      userId: reply.userId._id,
    }).then((res: any) => {
      if (res.status === 200) {
        socket.emit("delete_reply", res.data);
      }
    });
  };

  useEffect(() => {
    setEditedReply(reply.content);
  }, [reply]);

  return (
    <div className="ms-5 d-flex gap-2 mb-3">
      <img
        className="rounded-circle shadow-1-strong me-3"
        src={reply.userId.avatar}
        alt="avatar"
        width="65"
        height="65"
      />
      <div className="flex-grow-1 flex-shrink-1 d-flex flex-column">
        <div className="d-flex justify-content-between align-items-center">
          <p className="mb-1" style={{ fontWeight: 600 }}>
            {reply.userId.fullName}
          </p>
        </div>
        {isEditReply ? (
          <div className="d-flex gap-2">
            <input
              className="form-control w-50"
              type="text"
              value={editedReply}
              onChange={(evt: any) => setEditedReply(evt.target.value)}
            />
            <button
              className="btn btn-danger"
              onClick={() => setIsEditReply(false)}
            >
              Huỷ
            </button>
            <button
              className="btn btn-primary"
              onClick={() => {
                handleChangeReplyComment();
              }}
            >
              Xác nhận
            </button>
          </div>
        ) : (
          <p className="small mb-0">{reply.content}</p>
        )}
        {/* <p className="small mb-0">{reply.content}</p> */}
        {user && user._id === reply.userId._id ? (
          <div className="d-flex gap-2">
            <div
              className="position-relative d-flex gap-2"
              style={{ cursor: "pointer" }}
            >
              <span
                className="text-primary"
                onClick={() => setIsEditReply(true)}
              >
                Sửa
              </span>
              <span
                className="text-danger"
                onClick={() => handleDeleteReply(commentId, reply._id)}
              >
                Xoá
              </span>
            </div>
          </div>
        ) : (
          ""
        )}
      </div>
    </div>
  );
};
export default ReplyComment;
