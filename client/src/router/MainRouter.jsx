import { Outlet } from "react-router-dom";
import Footer from "../pages/shared/Footer";
import Navber from "../pages/shared/Navber";

const MainRouter = () => {
  return (
    <div className="font-roboto">
      <Navber />
      <Outlet />
      <Footer />
    </div>
  );
};

export default MainRouter;