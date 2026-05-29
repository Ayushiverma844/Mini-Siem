// src/components/ThreatChart.jsx

import { useContext } from "react";

import {
  ThreatContext,
} from "../context/ThreatContext";

const ThreatChart = () => {
  const {
    severityCount,
    totalScans,
  } = useContext(
    ThreatContext
  );

  const getPercentage = (
    value
  ) => {
    if (
      totalScans === 0
    )
      return 0;

    return Math.round(
      (value /
        totalScans) *
        100
    );
  };

  const threatData = [
    {
      level:
        "Critical",
      value:
        severityCount.Critical,
    },
    {
      level: "High",
      value:
        severityCount.High,
    },
    {
      level:
        "Medium",
      value:
        severityCount.Medium,
    },
    {
      level: "Low",
      value:
        severityCount.Low,
    },
  ];

  return (
    <div className="bg-[#07101f]/90 border border-cyan-500/10 rounded-[30px] p-7">
      <div className="flex items-center justify-between mb-8">
        <h2 className="text-2xl font-semibold">
          Threat Severity
          Distribution
        </h2>

        <span className="text-cyan-300 text-sm">
          Live Data
        </span>
      </div>

      <div className="space-y-7">
        {threatData.map(
          (
            item,
            index
          ) => {
            const percentage =
              getPercentage(
                item.value
              );

            return (
              <div
                key={
                  index
                }
              >
                <div className="flex justify-between mb-2">
                  <span className="text-gray-300">
                    {
                      item.level
                    }
                  </span>

                  <span className="text-cyan-300">
                    {
                      percentage
                    }
                    %
                  </span>
                </div>

                <div className="w-full h-3 rounded-full bg-[#111827] overflow-hidden">
                  <div
                    className="h-full rounded-full bg-cyan-400 transition-all duration-700"
                    style={{
                      width: `${percentage}%`,
                    }}
                  ></div>
                </div>
              </div>
            );
          }
        )}
      </div>
    </div>
  );
};

export default ThreatChart;