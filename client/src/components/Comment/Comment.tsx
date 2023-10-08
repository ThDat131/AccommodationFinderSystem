import { useEffect, useState } from "react";
import CommentInput from "../CommentInput/CommentInput";
import { io } from "socket.io-client";

const Comment = ({ comment }) => {
  const socket = io("http://localhost:8085");
  const [showCommentReplyInput, setShowCommentReplyInput] =
    useState<boolean>(false);

  const [replyComment, _setReplyComment] = useState<string>("");
  const [replies, setReplies] = useState([]);
  const [isEdit, setIsEdit] = useState<boolean>(false);
  const [editedComment, setEditedComment] = useState<string>("");

  const handleChangeComment = () => {
    console.log(editedComment)
  }

  useEffect(() => {
    setReplies(comment.replies);
    setEditedComment(comment.content);
  }, [comment]);

  return (
    <>
      <div className="d-flex flex-start my-3 flex-wrap w-100">
        <img
          className="rounded-circle shadow-1-strong me-3"
          src={comment.userId.avatar}
          alt="avatar"
          width="65"
          height="65"
        />
        <div className="flex-grow-1 flex-shrink-1 d-flex flex-column">
          <div className="d-flex justify-content-between align-items-center">
            <p className="mb-1" style={{ fontWeight: 600 }}>
              {comment.userId.fullName}
            </p>
          </div>
          {isEdit ? (
            <div className="d-flex gap-2">
              <input
                className="form-control w-50"
                type="text"
                value={editedComment}
                onChange={(evt: any) => setEditedComment(evt.target.value)}
              />
              <button className="btn btn-danger" onClick={() => setIsEdit(false)}>
                Huỷ
              </button>
              <button className="btn btn-primary" onClick={handleChangeComment}>
                Xác nhận
              </button>
            </div>
          ) : (
            <p className="small mb-0">{comment.content}</p>
          )}

          <div className="d-flex gap-2">
            <div
              className="position-relative d-flex gap-2"
              style={{ cursor: "pointer" }}
            >
              <span
                className="text-secondary"
                onClick={() => {
                  setShowCommentReplyInput(!showCommentReplyInput);
                }}
              >
                Phản hồi
              </span>
              <span className="text-primary" onClick={() => setIsEdit(!isEdit)}>
                Sửa
              </span>
              <span className="text-danger">Xoá</span>
            </div>
          </div>
        </div>
      </div>
      <div className={showCommentReplyInput ? "d-block" : "d-none"}>
        <CommentInput
          commentParent={comment}
          comment={replyComment}
          user={comment.userId}
          isClose={setShowCommentReplyInput}
        />
      </div>
      <div className="list-comment w-100">
        {replies &&
          replies.map((reply: any, index: number) => {
            return (
              <div key={index} className="ms-5 d-flex gap-2 mb-3">
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
                  <p className="small mb-0">{reply.content}</p>
                  <div className="d-flex gap-2">
                    <div
                      className="position-relative d-flex gap-2"
                      style={{ cursor: "pointer" }}
                    >
                      {/* <span className="text-primary">Sửa</span>
                    <span className="text-danger">Xoá</span> */}
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
      </div>
    </>
  );
};

export default Comment;
