import { useContext, useEffect, useState } from "react";
import NotificationItem from "../NotificationItem/NotificationItem";
import { authApis, endpoints } from "../../services/Apis";
import { MyUserContext } from "../../App";
import { Spinner } from "react-bootstrap";
import { socket } from "../../configs/socket";

const NotificationList = () => {
  const [user, _dispatch] = useContext(MyUserContext);
  const [notifications, setNotifications] = useState([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [trigger, setTrigger] = useState<boolean>(true);

  useEffect(() => {
    socket.on("receive_notification", (data) => {
      setNotifications([...notifications, data]);
    });
    return () => {
      socket.off("receive_notification");
    };
  }, [socket, notifications, trigger]);

  useEffect(() => {
    const loadNotifications = async () => {
      await authApis()
        .get(endpoints.get_notifications(user._id))
        .then((res) => {
          if (res.status === 200) {
            setNotifications(res.data);
            setIsLoading(false);
          }
        });
    };
    loadNotifications();
  }, [trigger, user._id]);

  if (isLoading)
    return (
      <div
        className="d-flex flex-column p-2 rounded"
        style={{
          backgroundColor: "#f5f5f5",
          position: "absolute",
          width: "200px",
          top: "30px",
          right: "50%",
          boxShadow: "1px 1px 8px 3px rgba(0, 0, 0, 0.8)",
          zIndex: 100,
        }}
      >
        <Spinner />
      </div>
    );
  return (
    <>
      <div
        className="d-flex flex-column p-2 rounded"
        style={{
          backgroundColor: "#f5f5f5",
          position: "absolute",
          width: "200px",
          top: "30px",
          right: "50%",
          boxShadow: "1px 1px 8px 3px rgba(0, 0, 0, 0.8)",
          zIndex: 100,
        }}
      >
        {notifications.map((notify, index) => {
          return <NotificationItem key={index} notify={notify} />;
        })}
      </div>
    </>
  );
};

export default NotificationList;
