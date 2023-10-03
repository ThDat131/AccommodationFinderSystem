import { useContext, useEffect, useState } from "react";
import MessageUser from "../../components/MessageUser/MessageUser";
import { getAllUser } from "../../services/Apis";
import { User } from "../../interface/User";
import { Spinner } from "react-bootstrap";
import MessageBox from "../../components/MessageBox/MessageBox";
import {
  collection,
  doc,
  getDoc,
  getDocs,
  onSnapshot,
  query,
  serverTimestamp,
  setDoc,
  updateDoc,
  where,
} from "firebase/firestore";
import { db } from "../../configs/firebase";
import { ChatUserContext, MyUserContext } from "../../App";
import { v4 as uuidv4 } from "uuid";

const MessageApp = () => {
  const [users, setUsers] = useState<Array<User>>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [search, setSearch] = useState<string>("");
  const [currentUser] = useContext(MyUserContext);
  const [isOpenMessageUser, setIsOpenMessageUser] = useState<boolean>(false);
  const [chatUserState, dispatchChatUserState] = useContext(ChatUserContext);
  const [userChats, setUserChats] = useState([]);

  useEffect(() => {
    const unsub = onSnapshot(
      doc(db, "userChats", currentUser._id),
      (doc) => {
        console.log(doc.data());
        // doc.exists() && setUserChats(doc.data());
      }
    );

    return () => {
      unsub();
    };
  }, []);

  console.log(userChats)

  const handleSearch = (evt: any) => {
    getAllUser("phone", evt.target.value).then((res) => {
      setUsers(res.data);
    });
    setIsOpenMessageUser(true);
  };

  const handleClickMessageUser = async (user: User) => {
    dispatchChatUserState({
      type: "ChangeUser",
      payload: {
        user: user,
        currentUser: currentUser,
      },
    });
    const channelId =
      currentUser._id > user._id
        ? currentUser._id + user._id
        : user._id + currentUser._id;

    try {
      const channelRef = doc(db, "channel", channelId);
      const channelSnap = await getDoc(channelRef);
      if (!channelSnap.exists()) {
        await setDoc(doc(db, "channel", channelId), {
          message: [],
        });
      }
      const userChatsRef = doc(db, "userChats", currentUser._id);
      const userChatsSnap = await getDoc(userChatsRef);
      if (!userChatsSnap.exists()) {
        await setDoc(doc(db, "userChats", currentUser._id), {
          [channelId + ".userInfo"]: {
            id: currentUser._id,
            fullName: currentUser.fullName,
            avatar: currentUser.avatar,
          },
          [channelId + ".date"]: serverTimestamp(),
        });
      } else {
        await updateDoc(doc(db, "userChats", currentUser._id), {
          [channelId + ".userInfo"]: {
            id: user._id,
            fullName: user.fullName,
            avatar: user.avatar,
          },
          [channelId + ".date"]: serverTimestamp(),
        });
      }
    } catch (err) {
      return err;
    }
    //create user chats
    setIsOpenMessageUser(false);
  };

  if (isLoading)
    return (
      <div className="d-flex align-items-center justify-content-center vh-100">
        <Spinner />
      </div>
    );

  return (
    <>
      <div className="container">
        <div className="row p-3" style={{ height: "calc(100vh - 76px)" }}>
          <div className="col-4 position-relative">
            <div className="d-flex gap-2">
              <input
                type="text"
                className="form-control"
                value={search}
                onChange={(e) => {
                  setSearch(e.target.value);
                }}
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    handleSearch(e);
                  }
                }}
                onBlur={() => {
                  setSearch("");
                }}
              />
              <button className="btn btn-primary">Search</button>
            </div>
            <div
              style={
                isOpenMessageUser
                  ? { display: "block", position: "absolute", top: "32px" }
                  : { visibility: "hidden" }
              }
            >
              {users.map((user: User, index: number) => {
                return (
                  <MessageUser
                    key={index}
                    user={user}
                    handleClick={handleClickMessageUser}
                  />
                );
              })}
            </div>
            {userChats
              ? userChats.map((userChat) => {
                  return (
                    <div
                      className="col-12 d-flex align-items-center gap-3 p-3 bg-light mt-3"
                      onClick={() => {}}
                    >
                      <img
                        src="https://w7.pngwing.com/pngs/178/595/png-transparent-user-profile-computer-icons-login-user-avatars-thumbnail.png"
                        alt=""
                        className="rounded rounded-circle"
                        width={50}
                        height={50}
                      />
                      <p className="m-0"></p>
                    </div>
                  );
                })
              : ""}
          </div>
          <div className="col-8 d-flex flex-column ">
            {chatUserState.user !== null ? (
              <MessageBox user={chatUserState.user} />
            ) : (
              ""
            )}
          </div>
        </div>
      </div>
    </>
  );
};

export default MessageApp;
