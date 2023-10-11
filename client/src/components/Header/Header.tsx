import {
  Container,
  ListGroup,
  Nav,
  NavDropdown,
  Navbar,
} from "react-bootstrap";
import { Link, useNavigate } from "react-router-dom";
import Logo from "../../assets/img/D2 -logos_transparent.png";
import { useContext, useEffect, useState } from "react";
import { MyUserContext } from "../../App";
import { toast } from "react-toastify";
import { getCategories } from "../../services/AuthApis";
import { Category } from "../../interface/Category";

const Header = () => {
  const nav = useNavigate();
  const [openOption, setOpenOption] = useState(false);
  const [user, dispatch] = useContext(MyUserContext);
  const [categories, setCategories] = useState<Array<Category>>([]);

  const logout = () => {
    dispatch({
      type: "logout",
    });
    nav("/signin");
    toast.success("Đã đăng xuất!");
  };

  useEffect(() => {
    getCategories().then((res) => {
      if (res.status === 200) {
        setCategories(res.data);
      }
    });
  }, []);

  return (
    <>
      <Navbar className="mb-3" expand="lg" data-bs-theme="dark" bg="primary">
        <Container>
          <Link to="/">
            <Navbar.Brand href="/">
              <img
                src={Logo}
                alt=""
                className="d-inline-block align-top"
                width={60}
                height={60}
              />
            </Navbar.Brand>
          </Link>
          <Navbar.Toggle aria-controls="basic-navbar-nav" />
          <Navbar.Collapse id="basic-navbar-nav">
            <Nav className="me-auto">
              <Link to="/">
                <Nav.Link href="/">Trang chủ</Nav.Link>
              </Link>
              <Link to={"/find-by-coordinates"}>
                <Nav.Link href="/find-by-coordinates">
                  Tìm nhà trọ theo toạ độ
                </Nav.Link>
              </Link>
              <Nav.Link>Thuê phòng</Nav.Link>
              <Nav.Link>Tìm phòng</Nav.Link>
              <Nav.Link>Tìm bạn ở ghép</Nav.Link>
              {user && user.landlordId && user.landlordId.active === true ? (
                <Link to="/create-post">
                  <Nav.Link href="/create-post">Đăng tin</Nav.Link>
                </Link>
              ) : (
                ""
              )}

              <NavDropdown title="Danh mục" id="basic-nav-dropdown">
                {categories.map((c) => {
                  const h = `/category/${c._id}`;
                  return (
                    <Link to={h} className="dropdown-item" key={c._id}>
                      <NavDropdown.Item href={h}>{c.name}</NavDropdown.Item>
                    </Link>
                  );
                })}
              </NavDropdown>
            </Nav>
            {user === null ? (
              <Nav className="ms-auto">
                <Link to="/signin">
                  <Nav.Link href="/signin">Sign In</Nav.Link>
                </Link>
                <Link to="signup">
                  <Nav.Link href="/signup">Sign Up</Nav.Link>
                </Link>
              </Nav>
            ) : (
              <Nav className="ms-auto">
                <div
                  className="d-flex align-items-center justify-content-center gap-2 position-relative"
                  style={{ cursor: "pointer" }}
                  onClick={() => setOpenOption(!openOption)}
                >
                  <img
                    src={user.avatar}
                    alt=""
                    width={50}
                    height={50}
                    className="rounded-circle"
                  />
                  <span className="text-light">{user.fullName}</span>
                </div>
                <ListGroup
                  className={
                    openOption ? `list-group position-absolute` : "d-none"
                  }
                  style={{ width: "200px", right: "185px", top: "65px", zIndex: "2" }}
                >
                  <Link to={`personal/${user._id}`}>
                    <ListGroup.Item
                      action
                      variant="light"
                      onClick={() => setOpenOption(!openOption)}
                    >
                      Thông tin
                    </ListGroup.Item>
                  </Link>

                  {user && user.role == "ROLE_ADMIN" ? (
                    <Link to={"/admin"}>
                      <ListGroup.Item
                        action
                        variant="light"
                        onClick={() => setOpenOption(!openOption)}
                      >
                        Trang quản trị (admin)
                      </ListGroup.Item>
                    </Link>
                  ) : (
                    ""
                  )}

                  <Link to={"/message-app"}>
                    <ListGroup.Item
                      action
                      variant="light"
                      onClick={() => setOpenOption(!openOption)}
                    >
                      Tin nhắn
                    </ListGroup.Item>
                  </Link>

                  <Link to="/setting">
                    <ListGroup.Item
                      action
                      variant="light"
                      onClick={() => setOpenOption(!openOption)}
                    >
                      Thông tin cá nhân
                    </ListGroup.Item>
                  </Link>
                  <ListGroup.Item action variant="light" onClick={logout}>
                    Đăng xuất
                  </ListGroup.Item>
                </ListGroup>
              </Nav>
            )}
          </Navbar.Collapse>
        </Container>
      </Navbar>
    </>
  );
};

export default Header;
