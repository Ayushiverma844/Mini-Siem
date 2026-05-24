import {
  LayoutDashboard,
  Mail,
  ShieldAlert,
  BarChart3,
  Settings
} from "lucide-react";

import { NavLink } from "react-router-dom";

function DashboardSidebar() {

  const navigationItems = [
    {
      name: "Dashboard Overview",
      icon: LayoutDashboard,
      path: "/"
    },
    {
      name: "Email Security",
      icon: Mail,
      path: "/email-security"
    },
    {
      name: "Log Monitoring",
      icon: ShieldAlert,
      path: "/log-monitoring"
    },
    {
      name: "Threat Analytics",
      icon: BarChart3,
      path: "/threat-analytics"
    },
    {
      name: "Settings",
      icon: Settings,
      path: "/settings"
    }
  ];

  return (
    <aside className="w-72 h-screen border-r border-emerald-500/20 bg-black/30 backdrop-blur-xl hidden lg:flex flex-col">

      <div className="p-6 border-b border-emerald-500/20">

        <h1 className="text-3xl font-bold bg-gradient-to-r from-cyan-400 to-emerald-400 bg-clip-text text-transparent">
          Mini SIEM
        </h1>

        <p className="text-sm text-gray-400 mt-2">
          Security Intelligence Platform
        </p>

      </div>

      <nav className="flex flex-col p-5 gap-3">

        {navigationItems.map((item) => {
          const Icon = item.icon;

          return (
            <NavLink
              key={item.name}
              to={item.path}
              className={({ isActive }) =>
                `flex items-center gap-4 p-4 rounded-2xl transition duration-300 ${
                  isActive
                    ? "bg-gradient-to-r from-cyan-500/20 to-emerald-500/20 border border-cyan-400"
                    : "hover:bg-white/5"
                }`
              }
            >
              <Icon size={20} />
              <span>{item.name}</span>
            </NavLink>
          );
        })}
      </nav>
    </aside>
  );
}

export default DashboardSidebar;