import { useContext, useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { getUserById } from "../../services/Apis";
import { Spinner } from "react-bootstrap";
import { follow, getListFollowing, unFollow } from "../../services/AuthApis";
import { MyUserContext } from "../../App";
import { toast } from "react-toastify";

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
  const [currentUser, _dispatch] = useContext(MyUserContext);
  const [userPersonal, setUserPersonal] = useState<User>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [followings, setFollowings] = useState([]);
  const [isFollow, setisFollow] = useState<boolean>(null);
  useEffect(() => {
    getUserById(id).then((res) => {
      setUserPersonal(res.data);
      setIsLoading(false);
    });
    getListFollowing(id).then((res) => {
      if (res.status === 200) setFollowings(res.data);
    });
  }, [isFollow]);

  useEffect(() => {
    followings.map((follow) => {
      if (follow.following === currentUser._id) {
        setisFollow(true);
        return;
      } else setisFollow(false);
    });
  }, [followings.length]);
  const handleFollow = () => {
    if (!currentUser) {
      toast.error("Vui lòng đăng nhập để tiếp tục");
      return;
    }
    if (userPersonal._id === currentUser._id) {
      toast.error("Không thể tự follow chính mình!");
      return;
    }
    follow({ follower: userPersonal._id, following: currentUser._id }).then(
      (res) => {
        if (res.status === 200) {
          setisFollow(true)
        }
      }
    );
  };
  const handleUnFollow = () => {
    unFollow({ follower: userPersonal._id, following: currentUser._id }).then(
      (res) => {
        if (res.status === 204) {
          setisFollow(false);
        }
      }
    );
  };

  if (isLoading)
    return (
      <div className="d-flex align-items-center justify-content-center vh-100">
        <Spinner />
      </div>
    );
  return (
    <>
      <div className="container px-5 pt-2">
        <div className="row align-items-end p-5 bg-body-secondary">
          <div className="col-6 d-flex align-items-center gap-5">
            <img
              src={userPersonal.avatar}
              alt=""
              className="rounded rounded-circle"
              width={150}
              height={150}
            />
            <div className="d-flex flex-column gap-3">
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
                {followings.length} Người theo dõi
              </p>
            </div>
          </div>
          <div className="col-6 d-flex gap-3 align-items-end justify-content-end">
            {!isFollow ? (
              <button className="btn btn-primary" onClick={handleFollow}>
                Theo dõi
              </button>
            ) : (
              <button className="btn btn-danger" onClick={handleUnFollow}>
                Bỏ theo dõi
              </button>
            )}

            <button className="btn btn-primary">Nhắn tin</button>
          </div>
        </div>
      </div>
    </>
  );
};

export default Personal;
