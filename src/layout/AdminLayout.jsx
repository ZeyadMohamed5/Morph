import { Outlet } from "react-router-dom";
import SideBar from "./components/sideBar";

const AdminLayout = () => {
  return (
    <div className="flex min-h-screen">
      <SideBar />
      <main className="bg-gray-50 flex-1">
        <Outlet />
      </main>
    </div>
  );
};
export default AdminLayout;
