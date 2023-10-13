import { useContext, useEffect, useState } from "react";
import { replyComment } from "../../services/AuthApis";
import { io } from "socket.io-client";
import { MyUserContext } from "../../App";

const CommentInput = ({ user, comment, commentParent, isClose }) => {
  const socket = io("ws://localhost:3005");
  const [commentContent, setCommentContent] = useState<string>("");
  const [currentUser, _dispatch] = useContext(MyUserContext);
  useEffect(() => {
    setCommentContent(comment);
  }, [comment]);
  const handleComment = () => {
    replyComment(commentParent._id, {
      content: commentContent,
      userId: currentUser._id,
    }).then((res: any) => {
      if (res.status === 200) {
        socket.emit("reply_comment", res.data);
        setCommentContent("");
        isClose(true);
      }
    });
  };
  return (
    <div className="ms-5 d-flex flex-start w-75 align-items-center gap-2">
      <img
        className="rounded-circle shadow-1-strong me-3"
        src={currentUser.avatar}
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
