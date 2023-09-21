import { Container, ListGroup, Nav, Navbar } from "react-bootstrap";
import { Link, useNavigate } from "react-router-dom";
import Logo from "../../assets/img/D2 -logos_transparent.png";
import { useContext, useState } from "react";
import { MyUserContext } from "../../App";
import { toast } from "react-toastify";

const Header = () => {
  const nav = useNavigate();
  const [openOption, setOpenOption] = useState(false);
  const [user, dispatch] = useContext(MyUserContext);

  const logout = () => {
    dispatch({
      type: "logout",
    });
    nav("/signin");
    toast.success("Đã đăng xuất!");
  };

  return (
    <>
      <Navbar expand="lg" data-bs-theme="dark" bg="primary">
        <Container>
          <Navbar.Brand href="/">
            <img
              src={Logo}
              alt=""
              className="d-inline-block align-top"
              width={60}
              height={60}
            />
          </Navbar.Brand>
          <Navbar.Toggle aria-controls="basic-navbar-nav" />
          <Navbar.Collapse id="basic-navbar-nav">
            <Nav className="me-auto">
              <Nav.Link>Home</Nav.Link>
              <Nav.Link>Rent a room</Nav.Link>
              <Nav.Link>Find a room</Nav.Link>
              <Nav.Link>Find a roommate</Nav.Link>
            </Nav>
            {user === null ? (
              <Nav className="ms-auto">
                <Nav.Link href="/signin">Sign In</Nav.Link>
                <Nav.Link href="/signup">Sign Up</Nav.Link>
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
                    width={30}
                    height={30}
                    className="rounded-circle"
                  />
                  <span className="text-light">{user.fullName}</span>
                </div>
                <ListGroup
                  className={
                    openOption ? `list-group position-absolute` : "d-none"
                  }
                  style={{ top: "65px" }}
                >
                  <ListGroup.Item
                    action
                    variant="light"
                    onClick={() => setOpenOption(!openOption)}
                  >
                    Personal Info
                  </ListGroup.Item>
                  <Link to="/setting">
                    <ListGroup.Item
                      action
                      variant="light"
                      onClick={() => setOpenOption(!openOption)}
                    >
                      Setting
                    </ListGroup.Item>
                  </Link>
                  <ListGroup.Item action variant="light" onClick={logout}>
                    Logout
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
