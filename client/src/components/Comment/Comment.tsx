import { useContext, useEffect, useState } from "react";
import CommentInput from "../CommentInput/CommentInput";
import { io } from "socket.io-client";
import { deleteComment, editComment } from "../../services/AuthApis";
import { MyUserContext } from "../../App";
import ReplyComment from "../ReplyComment/ReplyComment";
import { toast } from "react-toastify";

const Comment = ({ comment }) => {
  const socket = io("ws://localhost:3005");
  const [showCommentReplyInput, setShowCommentReplyInput] =
    useState<boolean>(false);

  const [user, _dispatch] = useContext(MyUserContext);
  const [replyComment, _setReplyComment] = useState<string>("");
  const [replies, setReplies] = useState([]);
  const [isEdit, setIsEdit] = useState<boolean>(false);
  const [editedComment, setEditedComment] = useState<string>("");

  const handleChangeComment = (id: string) => {
    editComment(id, {
      userId: comment.userId._id,
      content: editedComment,
    }).then((res: any) => {
      if (res.status === 200) {
        socket.emit("edit_comment", res.data);
        setIsEdit(false);
      }
    });
  };

  const handleDeleteComment = (id: string) => {
    if (!confirm("Bạn có chắc chắn muốn xoá không?")) {
      return;
    }
    deleteComment(id, { userId: user._id }).then((res: any) => {
      if (res.status === 200) {
        socket.emit("delete_comment", id);
      }
    });
  };

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
          width="60"
          height="60"
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
              <button
                className="btn btn-danger"
                onClick={() => setIsEdit(false)}
              >
                Huỷ
              </button>
              <button
                className="btn btn-primary"
                onClick={() => handleChangeComment(comment._id)}
              >
                Xác nhận
              </button>
            </div>
          ) : (
            <p className="small mb-0">{comment.content}</p>
          )}

          <div className="d-flex gap-2">
            {user ? (
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
                {user._id === comment.userId._id ? (
                  <>
                    <span
                      className="text-primary"
                      onClick={() => setIsEdit(!isEdit)}
                    >
                      Sửa
                    </span>
                    <span
                      className="text-danger"
                      onClick={() => handleDeleteComment(comment._id)}
                    >
                      Xoá
                    </span>
                  </>
                ) : (
                  ""
                )}
              </div>
            ) : (
              ""
            )}
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
              <ReplyComment reply={reply} key={index} commentId={comment._id} />
            );
          })}
      </div>
    </>
  );
};

export default Comment;
