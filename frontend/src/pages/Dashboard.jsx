// src/pages/Dashboard.jsx

import { useRef } from "react";

import NavigationBar from "../components/NavigationBar";
import WelcomePanel from "../components/WelcomePanel";
import ModuleCards from "../components/ModuleCards";
import StatisticsCards from "../components/StatisticsCards";
import ThreatChart from "../components/ThreatChart";
import ScanTable from "../components/ScanTable";

const Dashboard = () => {
  // References
  const moduleSectionRef =
    useRef(null);

  const reportSectionRef =
    useRef(null);

  // Scroll Functions
  const scrollToModules = () => {
    moduleSectionRef.current?.scrollIntoView({
      behavior: "smooth",
      block: "start",
    });
  };

  const scrollToReports = () => {
    reportSectionRef.current?.scrollIntoView({
      behavior: "smooth",
      block: "start",
    });
  };

  return (
    <div className="min-h-screen bg-[#020817] text-white overflow-hidden relative">

      {/* Background Grid */}
      <div className="absolute inset-0 bg-[linear-gradient(rgba(0,255,255,0.04)_1px,transparent_1px),linear-gradient(90deg,rgba(0,255,255,0.04)_1px,transparent_1px)] bg-[size:50px_50px] pointer-events-none"></div>

      {/* Blue Glow */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[700px] h-[500px] bg-cyan-500/10 blur-[140px] rounded-full"></div>

      <div className="relative z-10 px-8">
        <NavigationBar />

        <div className="mt-8">
          <WelcomePanel
            onStartAnalysis={
              scrollToModules
            }
            onViewReports={
              scrollToReports
            }
          />
        </div>

        {/* Module Section */}
        <div
          ref={moduleSectionRef}
          className="mt-8"
        >
          <ModuleCards />
        </div>

        <div className="mt-8">
          <StatisticsCards />
        </div>

        {/* Reports Section */}
        <div
          ref={reportSectionRef}
          className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-8 pb-10"
        >
          <ThreatChart />
          <ScanTable />
        </div>
      </div>
    </div>
  );
};

export default Dashboard;