import { useState } from "react";
import CommentInput from "../CommentInput/CommentInput";

const Comment = ({ comment }) => {
  const [showCommentReplyInput, setShowCommentReplyInput] =
    useState<boolean>(false);

  const [replyComment, setReplyComment] = useState<string>("");

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
          <p className="small mb-0">{comment.content}</p>
          <div className="d-flex gap-2">
            <div className="position-relative d-flex gap-2" style={{cursor: 'pointer'}}>
              <span
                className="text-secondary"
                onClick={() => {
                  setShowCommentReplyInput(!showCommentReplyInput);
                }}
              >
                Phản hồi
              </span>
              <span className="text-primary">Sửa</span>
              <span className="text-danger">Xoá</span>
            </div>
          </div>
        </div>
      </div>
      <div className="list-comment">
      </div>
      <div className={showCommentReplyInput ? "d-block" : "d-none"}>
        <CommentInput commentParent={comment} comment={replyComment} user={comment.userId} />
      </div>
    </>
  );
};

export default Comment;
