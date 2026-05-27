// src/components/ThreatChart.jsx

const ThreatChart = () => {
  const threatData = [
    {
      level: "Critical",
      percentage: "85%",
      width: "w-[85%]",
    },
    {
      level: "High",
      percentage: "65%",
      width: "w-[65%]",
    },
    {
      level: "Medium",
      percentage: "45%",
      width: "w-[45%]",
    },
    {
      level: "Low",
      percentage: "25%",
      width: "w-[25%]",
    },
  ];

  return (
    <div className="bg-[#07101f]/90 border border-cyan-500/10 rounded-[30px] p-7">
      <div className="flex items-center justify-between mb-8">
        <h2 className="text-2xl font-semibold">
          Threat Severity Distribution
        </h2>

        <button className="text-cyan-300 text-sm">
          Last 7 Days
        </button>
      </div>

      <div className="space-y-7">
        {threatData.map((item, index) => (
          <div key={index}>
            <div className="flex justify-between mb-2">
              <span className="text-gray-300">
                {item.level}
              </span>

              <span className="text-cyan-300">
                {item.percentage}
              </span>
            </div>

            <div className="w-full h-3 rounded-full bg-[#111827] overflow-hidden">
              <div
                className={`h-full rounded-full bg-cyan-400 ${item.width}`}
              ></div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ThreatChart;