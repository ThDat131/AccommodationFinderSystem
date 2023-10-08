import { useEffect, useState } from "react";
import { createComment } from "../../services/AuthApis";
import { io } from "socket.io-client";

const CommentInput = ({ user, comment, commentParent }) => {
  const socket = io("http://localhost:8085", {
    reconnection: true,
  });
  const [commentContent, setCommentContent] = useState<string>("");
  useEffect(() => {
    setCommentContent(comment);
  }, [comment]);
  const handleComment = () => {
    createComment({
      commentId: commentParent._id,
      content: commentContent,
      postId: commentParent.postId,
      userId: commentParent.userId._id,
    }).then((res: any) => {
      //   socket.emit("send_comment", res.data);
      if (res.status === 201) {
        console.log(res.data);
        setCommentContent("");
      }
    });
  };
  return (
    <div className="ms-5 d-flex flex-start w-75 align-items-center gap-2">
      <img
        className="rounded-circle shadow-1-strong me-3"
        src={user.avatar}
        alt="avatar"
        width="40"
        height="40"
      />
      <div className="form-floating w-100">
        <input
          className="form-control"
          placeholder="Leave a comment here"
          id="floatingTextarea"
          onChange={(e) => setCommentContent(e.target.value)}
          value={commentContent}
        ></input>
        <label htmlFor="floatingTextarea">Phản hồi</label>
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
  );
};
export default CommentInput;
