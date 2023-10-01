import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { getUserById } from "../../services/Apis";
import { Spinner } from "react-bootstrap";

const Personal = () => {
  interface User {
    _id: string;
    email: string;
    avatar: string;
    role: string;
    active: boolean;
    fullName: string;
    phone: string;
  }

  const { id } = useParams();
  const [userPersonal, setUserPersonal] = useState<User>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  useEffect(() => {
    getUserById(id).then((res) => {
      setUserPersonal(res.data);
      setIsLoading(false);
    });
  });

  if (isLoading)
    return (
      <div className="d-flex align-items-center justify-content-center vh-100">
        <Spinner />
      </div>
    );
  return (
    <>
      <div className="container px-5 pt-2">
        <div className="row align-items-end">
          <div className="col-6 d-flex align-items-end gap-3">
            <img
              src={userPersonal.avatar}
              alt=""
              className="rounded rounded-circle"
              width={150}
              height={150}
            />
            <div className="d-flex flex-column">
              <p
                style={{
                  fontSize: "24px",
                  textDecoration: "bold",
                  fontWeight: "600",
                }}
                className="m-0"
              >
                {userPersonal.fullName}
              </p>
              <p
                style={{
                  fontSize: "18px",
                  textDecoration: "bold",
                  fontWeight: "400",
                }}
                className="m-0"
              >
                1xxx Followers
              </p>
            </div>
          </div>
          <div className="col-6 d-flex gap-3 align-items-end justify-content-end">
            <button className="btn btn-primary">+ Follow</button>
            <button className="btn btn-primary">Message</button>
          </div>
        </div>
      </div>
    </>
  );
};

export default Personal;
