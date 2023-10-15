import { useEffect, useState } from "react";

import { User } from "../../interface/User";
import { Spinner } from "react-bootstrap";

const MessageUser = ({ user, handleClick }) => {
  const [messageUser, setMessageUser] = useState<User>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  useEffect(() => {
    setMessageUser(user);
    setIsLoading(false);
  }, [user]);

  if (isLoading)
    return (
      <div className="d-flex align-items-center justify-content-center vh-100">
        <Spinner />
      </div>
    );

  return (
    <>
      <div
        className="col-12 d-flex align-items-center gap-3 p-3 bg-light mt-3"
        onClick={() => {
          handleClick(messageUser);
        }}
      >
        <img
          src={messageUser.avatar}
          alt=""
          className="rounded rounded-circle"
          width={50}
          height={50}
        />
        <p className="m-0">{messageUser.fullName}</p>
      </div>
    </>
  );
};

export default MessageUser;
