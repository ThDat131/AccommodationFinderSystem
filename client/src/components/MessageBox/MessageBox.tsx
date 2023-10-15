import { useContext, useEffect, useState } from "react";
import MessageSend from "../MessageSend/MessageSend";
import {
  doc,
  onSnapshot,
  updateDoc,
  arrayUnion,
  Timestamp,
} from "firebase/firestore";
import { db } from "../../configs/firebase";
import { ChatUserContext, MyUserContext } from "../../App";
import { v4 as uuidv4 } from "uuid";

const MessageBox = ({ user }) => {
  const [messages, setMessages] = useState([]);
  const [message, setMessage] = useState<string>("");
  const [currentUser] = useContext(MyUserContext);
  const [chatUserState, _dispatchChatUserState] = useContext(ChatUserContext);
  const handleSendMessage = async () => {
    if (message === "") return;

    const channelRef = doc(db, "channel", chatUserState.channelId);
    await updateDoc(channelRef, {
      message: arrayUnion({
        id: uuidv4(),
        content: message,
        senderId: currentUser._id,
        date: Timestamp.now(),
      }),
    });

    setMessage("");
  };

  useEffect(() => {
    const unsub = onSnapshot(
      doc(db, "channel", chatUserState.channelId),
      (doc) => {
        doc.exists() && setMessages(doc.data().message);
      }
    );

    return () => {
      unsub();
    };
  }, [user]);

  return (
    <>
      <div className="section-header d-flex gap-3 align-items-center bg-light px-4 py-2 border-bottom">
        <img
          src={user.avatar}
          alt=""
          className="rounded rounded-circle"
          width={70}
          height={70}
        />
        <p className="m-0">{user.fullName}</p>
      </div>
      <div
        className="section-body d-flex flex-column align-items-end h-100 bg-light overflow-auto position-relative"
        style={{ maxHeight: "475px" }}
      >
        {messages
          ? messages.map((msg, index: number) => {
              return <MessageSend key={index} msg={msg} />;
            })
          : ""}
      </div>
      <div className="section-input d-flex gap-2 py-2">
        <input
          type="text"
          className="form-control"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          onKeyDown={(event) => {
            if (event.key === "Enter") handleSendMessage();
          }}
        />
        <button className="btn btn-primary" onClick={handleSendMessage}>
          Send
        </button>
      </div>
    </>
  );
};

export default MessageBox;
