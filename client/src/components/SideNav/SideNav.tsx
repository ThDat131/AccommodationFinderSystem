import { useState } from "react";
import { ListGroup } from "react-bootstrap";
import { Link } from "react-router-dom";

const SideNav = () => {
  const [selectedNav, setSelectedNav] = useState(0);

  return (
    <>
      <div
        className="col-2 position-fixed bg-light vh-100 p-2 d-flex flex-column"
        style={{ top: 0, left: 0 }}
      >
        <h2 className="text-primary border-bottom pb-3 text-center">
          Admin Page
        </h2>

        <ListGroup as="ul" variant="light">
          <Link to="/admin">
            <ListGroup.Item
              action
              as="li"
              active={selectedNav === 0}
              onClick={() => setSelectedNav(0)}
            >
              Main
            </ListGroup.Item>
          </Link>
          <Link to="/admin/users">
            <ListGroup.Item
              action
              as="li"
              active={selectedNav === 1}
              onClick={() => setSelectedNav(1)}
            >
              Quản lý người dùng
            </ListGroup.Item>
          </Link>
          <Link to="/admin/categories">
            <ListGroup.Item
              action
              as="li"
              active={selectedNav === 2}
              onClick={() => setSelectedNav(2)}
            >
              Quản lý danh mục
            </ListGroup.Item>
          </Link>

          {/* <ListGroup.Item
            action
            as="li"
            active={selectedNav === 2}
            onClick={() => setSelectedNav(2)}
          >
            Approve Post
          </ListGroup.Item> */}
          <Link to="/admin/posts/stats">
            <ListGroup.Item
              action
              as="li"
              active={selectedNav === 3}
              onClick={() => setSelectedNav(3)}
            >
              Thống kê số lượng bài đăng
            </ListGroup.Item>
          </Link>
          <Link to="/admin/users/stats">
            <ListGroup.Item
              action
              as="li"
              active={selectedNav === 4}
              onClick={() => setSelectedNav(4)}
            >
              Thống kê số lượng người dùng
            </ListGroup.Item>
          </Link>
          <Link to="/">
            <ListGroup.Item action as="li">
              Trở về trang chủ
            </ListGroup.Item>
          </Link>
        </ListGroup>
      </div>
    </>
  );
};

export default SideNav;
