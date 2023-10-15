import { Link } from "react-router-dom";

const NotificationItem = ({ notify }) => {
  return (
    <>
      <div
        className="d-flex align-items-center mb-3 bg-primary text-light rounded p-2"
        style={{ cursor: "pointer" }}
      >
        {notify.content}
      </div>
    </>
  );
};

export default NotificationItem;
