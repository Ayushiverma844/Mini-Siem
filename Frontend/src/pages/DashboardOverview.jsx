import {
  ShieldCheck,
  Mail,
  Activity,
  AlertTriangle
} from "lucide-react";

import { motion } from "framer-motion";

import StatusCard from "../components/ui/StatusCard";

function DashboardOverview() {

  const recentThreats = [
    {
      id: 1,
      source: "Email Detection",
      type: "Credential Harvesting",
      severity: "High",
      status: "Blocked"
    },
    {
      id: 2,
      source: "Log Monitoring",
      type: "Suspicious Login",
      severity: "Medium",
      status: "Detected"
    },
    {
      id: 3,
      source: "Email Detection",
      type: "Financial Scam",
      severity: "Critical",
      status: "Blocked"
    }
  ];

  return (
    <div className="space-y-8">

      {/* Page Header */}

      <div className="flex justify-between items-center flex-wrap gap-4">

        <div>
          <h1 className="text-5xl font-bold">
            Security Overview
          </h1>

          <p className="text-gray-400 mt-2 text-lg">
            Real-time cybersecurity monitoring dashboard
          </p>
        </div>

        <div className="
        px-5 py-3
        rounded-2xl
        border border-emerald-500/30
        bg-emerald-500/10
        text-emerald-400
        font-semibold
        ">
          System Status: Protected
        </div>

      </div>

      {/* Statistics Cards */}

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6">

        <StatusCard
          title="Threats Blocked"
          value="1,284"
          description="Secured in last 24 hours"
          icon={<ShieldCheck />}
        />

        <StatusCard
          title="Emails Scanned"
          value="8,942"
          description="Phishing detection active"
          icon={<Mail />}
        />

        <StatusCard
          title="Log Events"
          value="12,530"
          description="Continuous monitoring"
          icon={<Activity />}
        />

        <StatusCard
          title="Critical Alerts"
          value="08"
          description="Immediate action required"
          icon={<AlertTriangle />}
        />

      </div>

      {/* Monitoring Panels */}

      <div className="grid lg:grid-cols-2 gap-6">

        {/* Threat Activity */}

        <motion.div
          whileHover={{
            scale: 1.01
          }}
          className="
          rounded-3xl
          border border-cyan-500/20
          bg-white/5
          backdrop-blur-2xl
          p-8
          "
        >
          <h2 className="text-2xl font-semibold mb-6">
            Threat Activity
          </h2>

          <div className="space-y-5">

            <div>
              <div className="flex justify-between mb-2">
                <span>Email Threat Detection</span>
                <span>89%</span>
              </div>

              <div className="h-3 bg-gray-800 rounded-full">
                <div className="w-[89%] h-full rounded-full bg-gradient-to-r from-cyan-400 to-emerald-400"></div>
              </div>
            </div>

            <div>
              <div className="flex justify-between mb-2">
                <span>Log Monitoring</span>
                <span>74%</span>
              </div>

              <div className="h-3 bg-gray-800 rounded-full">
                <div className="w-[74%] h-full rounded-full bg-gradient-to-r from-cyan-400 to-emerald-400"></div>
              </div>
            </div>

            <div>
              <div className="flex justify-between mb-2">
                <span>System Security</span>
                <span>96%</span>
              </div>

              <div className="h-3 bg-gray-800 rounded-full">
                <div className="w-[96%] h-full rounded-full bg-gradient-to-r from-cyan-400 to-emerald-400"></div>
              </div>
            </div>

          </div>
        </motion.div>

        {/* Live Monitoring */}

        <motion.div
          whileHover={{
            scale: 1.01
          }}
          className="
          rounded-3xl
          border border-emerald-500/20
          bg-white/5
          backdrop-blur-2xl
          p-8
          "
        >
          <h2 className="text-2xl font-semibold mb-6">
            Live Monitoring
          </h2>

          <div className="space-y-5">

            <div className="flex items-center justify-between">

              <div>
                <h3 className="font-semibold">
                  Email Protection
                </h3>

                <p className="text-gray-400 text-sm">
                  Active scanning enabled
                </p>
              </div>

              <div className="w-4 h-4 bg-emerald-400 rounded-full animate-pulse"></div>

            </div>

            <div className="flex items-center justify-between">

              <div>
                <h3 className="font-semibold">
                  Log Threat Detection
                </h3>

                <p className="text-gray-400 text-sm">
                  Monitoring network activity
                </p>
              </div>

              <div className="w-4 h-4 bg-emerald-400 rounded-full animate-pulse"></div>

            </div>

            <div className="flex items-center justify-between">

              <div>
                <h3 className="font-semibold">
                  Risk Monitoring
                </h3>

                <p className="text-gray-400 text-sm">
                  Threat analytics running
                </p>
              </div>

              <div className="w-4 h-4 bg-emerald-400 rounded-full animate-pulse"></div>

            </div>

          </div>
        </motion.div>

      </div>

      {/* Recent Threat Table */}

      <div className="
      rounded-3xl
      border border-cyan-500/20
      bg-white/5
      backdrop-blur-2xl
      p-8
      overflow-x-auto
      ">

        <h2 className="text-2xl font-semibold mb-6">
          Recent Security Events
        </h2>

        <table className="w-full">

          <thead>
            <tr className="border-b border-white/10 text-left text-gray-400">

              <th className="pb-4">Source</th>
              <th className="pb-4">Threat Type</th>
              <th className="pb-4">Severity</th>
              <th className="pb-4">Status</th>

            </tr>
          </thead>

          <tbody>

            {recentThreats.map((threat) => (
              <tr
                key={threat.id}
                className="border-b border-white/5"
              >
                <td className="py-5">
                  {threat.source}
                </td>

                <td>
                  {threat.type}
                </td>

                <td>
                  <span className="
                  px-3 py-1 rounded-full
                  bg-red-500/20
                  text-red-400
                  text-sm
                  ">
                    {threat.severity}
                  </span>
                </td>

                <td className="text-emerald-400">
                  {threat.status}
                </td>
              </tr>
            ))}

          </tbody>

        </table>

      </div>

    </div>
  );
}

export default DashboardOverview;