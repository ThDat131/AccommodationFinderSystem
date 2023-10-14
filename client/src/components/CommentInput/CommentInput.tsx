import { useContext, useEffect, useState } from "react";
import { replyComment } from "../../services/AuthApis";
import { MyUserContext } from "../../App";
import { socket } from "../../configs/socket";

const CommentInput = ({
  user,
  comment,
  commentParent,
  isClose,
  setTrigger,
}) => {
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
        socket.emit("send_reply_comment", res.data);
        setTrigger("reply_comment");
        setCommentContent("");
        isClose(false);
      }
    });
  };
  if (!currentUser) {
    return <></>;
  }
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
          id={commentParent._id}
          className="form-control"
          placeholder="Leave a comment here"
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
