import { Outlet } from "react-router-dom";
import { useState } from "react";
import AdminHeader from "./AdminHeader";
import AdminSidePanel from "./AdminSidePanel";

function AdminLayout() {
  const [selection, setSelection] = useState("Dashboard");

  return (
    <div className="flex">
      <AdminSidePanel selection={selection} setSelection={setSelection} />

      <div className="flex-1 flex flex-col min-h-screen">
        <AdminHeader selection={selection} setSelection={setSelection} />

        {/* pt-[73px] pushes content below the fixed header */}
        <main className="pt-[30px] p-6 flex-1">
          <Outlet />
        </main>
      </div>
    </div>
  );
}

export default AdminLayout;
