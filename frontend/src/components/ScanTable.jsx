// src/components/ScanTable.jsx

import { useContext } from "react";

import {
  ThreatContext,
} from "../context/ThreatContext";

const ScanTable = () => {
  const {
    scanHistory,
  } = useContext(
    ThreatContext
  );

  return (
    <div className="bg-[#07101f]/90 border border-cyan-500/10 rounded-[30px] p-7 overflow-hidden">
      <div className="flex items-center justify-between mb-8">
        <h2 className="text-2xl font-semibold">
          Recent Scan History
        </h2>
      </div>

      {scanHistory.length ===
      0 ? (
        <div className="h-[250px] flex items-center justify-center text-gray-500">
          No scans available
        </div>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="border-b border-cyan-500/10 text-gray-400 text-sm">
                <th className="pb-4">
                  File Name
                </th>
                <th className="pb-4">
                  Status
                </th>
                <th className="pb-4">
                  Risk
                </th>
                <th className="pb-4">
                  Time
                </th>
              </tr>
            </thead>

            <tbody>
              {scanHistory.map(
                (
                  item,
                  index
                ) => (
                  <tr
                    key={index}
                    className="border-b border-cyan-500/5 hover:bg-cyan-500/5 transition"
                  >
                    <td className="py-5 text-gray-300">
                      {
                        item.file
                      }
                    </td>

                    <td className="py-5">
                      <span className="px-4 py-2 rounded-full bg-cyan-500/10 text-cyan-300 text-sm border border-cyan-500/10">
                        {
                          item.status
                        }
                      </span>
                    </td>

                    <td className="py-5 text-gray-300">
                      {
                        item.risk
                      }
                    </td>

                    <td className="py-5 text-gray-500">
                      {
                        item.time
                      }
                    </td>
                  </tr>
                )
              )}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default ScanTable;