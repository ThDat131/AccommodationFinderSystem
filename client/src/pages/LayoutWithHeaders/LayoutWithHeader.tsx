import { Outlet } from "react-router-dom";
import Header from "../../components/Header/Header";

const LayoutWithHeader = () => {
  return (
    <>
      <div className="vh-100">
        <Header />
        <Outlet />
      </div>
    </>
  );
};

export default LayoutWithHeader;
