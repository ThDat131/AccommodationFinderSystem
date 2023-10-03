import { Outlet } from "react-router-dom"
import SideNav from "../../components/SideNav/SideNav";

const LayoutAdmin = () => {
    return (
      <>
        <div className="d-flex">
          <div className="col-2">
            <SideNav />
          </div>
          <div className="col-10">
            <Outlet />
          </div>
        </div>
      </>
    );
}
export default LayoutAdmin