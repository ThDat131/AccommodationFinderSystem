import { useContext, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { MyUserContext } from "../../App";

const MainAdmin = () => {
  const navigate = useNavigate();
  const [user, _dispatch] = useContext(MyUserContext);

  useEffect(() => {
  if (!user || user.role !== "ROLE_ADMIN") return navigate("/forbidden");
  })

  return (
    <>
      <h1>Main Admin</h1>
    </>
  );
};

export default MainAdmin;
