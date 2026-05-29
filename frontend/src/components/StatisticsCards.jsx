// src/components/StatisticsCards.jsx

import { useContext } from "react";

import {
  ThreatContext,
} from "../context/ThreatContext";

const StatisticsCards = () => {
  const {
    totalScans,
    threatsDetected,
    safeFiles,
    criticalAlerts,
  } = useContext(
    ThreatContext
  );

  const statistics = [
    {
      title: "Total Scans",
      value: totalScans,
      icon: "📊",
    },
    {
      title:
        "Threats Detected",
      value:
        threatsDetected,
      icon: "⚠️",
    },
    {
      title: "Safe Files",
      value: safeFiles,
      icon: "✅",
    },
    {
      title:
        "Critical Alerts",
      value:
        criticalAlerts,
      icon: "🚨",
    },
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 mt-12">
      {statistics.map(
        (item, index) => (
          <div
            key={index}
            className="bg-[#07101f]/90 border border-cyan-500/10 hover:border-cyan-500/30 transition duration-300 rounded-[26px] p-6 relative overflow-hidden"
          >
            {/* Glow */}
            <div className="absolute top-0 right-0 w-28 h-28 bg-cyan-500/10 blur-[70px] rounded-full"></div>

            <div className="relative z-10">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-400 text-sm">
                    {item.title}
                  </p>

                  <h2 className="text-3xl font-bold mt-2">
                    {item.value}
                  </h2>
                </div>

                <div className="w-14 h-14 rounded-2xl bg-cyan-500/10 border border-cyan-500/20 flex items-center justify-center text-2xl">
                  {item.icon}
                </div>
              </div>

              <p className="text-cyan-300 text-sm mt-5">
                Real-time data
              </p>
            </div>
          </div>
        )
      )}
    </div>
  );
};

export default StatisticsCards;