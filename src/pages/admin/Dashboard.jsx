import AdminHeader from "../../components/ui/AdminHeader";
import AdminSidePanel from "../../components/ui/AdminSidePanel";

function Dashboard() {
  return (
    <>
      <div>
        {/* header and notification */}
        <AdminHeader />
        {/* side section */}
        <AdminSidePanel />
        
      </div>
    </>
  );
}

export default Dashboard;
