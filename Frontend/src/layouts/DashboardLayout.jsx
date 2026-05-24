import { Outlet } from "react-router-dom";

import DashboardSidebar from "../components/layout/DashboardSidebar";
import DashboardNavbar from "../components/layout/DashboardNavbar";
import AnimatedBackground from "../components/ui/AnimatedBackground";

function DashboardLayout() {
  return (
    <div className="relative min-h-screen bg-[#041414] text-white overflow-hidden">

      <AnimatedBackground />

      <div className="flex relative z-10">

        <DashboardSidebar />

        <div className="flex-1 flex flex-col">

          <DashboardNavbar />

          <main className="p-6">
            <Outlet />
          </main>

        </div>
      </div>
    </div>
  );
}

export default DashboardLayout;