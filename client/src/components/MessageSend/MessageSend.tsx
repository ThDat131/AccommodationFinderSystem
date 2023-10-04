import { useContext } from "react";
import { MyUserContext } from "../../App";

const MessageSend = ({ msg }) => {
  const [currentUser, _dispatch] = useContext(MyUserContext);

  return (
    <>
      {msg.senderId === currentUser._id ? (
        <div
          className="d-flex align-items-center gap-2 my-3 mx-2 ms-auto"
          style={{ maxWidth: "540px", wordWrap: "break-word" }}
        >
          <span className="font-weight-light"></span>
          <span
            className="m-0 text-light bg-primary rounded rounded-pill px-3 py-2 flex-growth-1 word-wrap"
            style={{ minWidth: "50px" }}
          >
            {msg.content}
          </span>
        </div>
      ) : (
        <div
          className="d-flex align-items-center gap-2 my-3 mx-2 me-auto"
          style={{ maxWidth: "560px", wordWrap: "break-word" }}
        >
          <span className="font-weight-light"></span>
          <span
            className="m-0 text-light bg-secondary rounded rounded-pill px-3 py-2 flex-growth-1 word-wrap"
            style={{ minWidth: "50px" }}
          >
            {msg.content}
          </span>
        </div>
      )}
    </>
  );
};

export default MessageSend;
