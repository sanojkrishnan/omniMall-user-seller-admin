import { Outlet } from "react-router-dom";
import AdminHeader from "../components/ui/AdminHeader";
import AdminSidePanel from "../components/ui/AdminSidePanel";

function AdminLayout() {
  return (
    <div className="flex">
      <AdminSidePanel />

      <div className="flex-1 flex flex-col min-h-screen">
        <AdminHeader />

        {/* pt-[73px] pushes content below the fixed header */}
        <main className="pt-[30px] p-6 flex-1">
          <Outlet />
        </main>
      </div>
    </div>
  );
}

export default AdminLayout;
