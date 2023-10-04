import { Outlet } from "react-router-dom";
import Header from "../../components/Header/Header";

const LayoutWithHeader = () => {
  return (
    <>
      <Header />
      <Outlet />
    </>
  );
};

export default LayoutWithHeader;
