// src/components/NavigationBar.jsx

import { useNavigate, useLocation } from "react-router-dom";
import { Menu, X } from "lucide-react";
import { useState } from "react";

const NavigationBar = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const [mobileMenu, setMobileMenu] =
    useState(false);

  const navigationItems = [
    {
      label: "Control Center",
      path: "/",
    },
    {
      label: "Email Intel",
      path: "/email-analysis",
    },
    {
      label: "Log SOC",
      path: "/log-analysis",
    },
  ];

  return (
    <nav className="sticky top-0 z-50 pt-5">
      <div className="backdrop-blur-xl bg-[#07101f]/70  rounded-[28px] px-5 py-4">

        <div className="flex items-center justify-between">

          {/* Brand Identity */}
          <div
            onClick={() => navigate("/")}
            className="flex items-center gap-3 cursor-pointer"
          >
            <div className="relative w-12 h-12 rounded-2xl border border-cyan-400/30 bg-cyan-500/10 flex items-center justify-center overflow-hidden">

              {/* Animated Glow */}
              <div className="absolute inset-0 bg-cyan-400/10 animate-pulse"></div>

              <span className="relative z-10 text-cyan-400 font-bold text-lg">
                M
              </span>
            </div>

            <div>
              

              <p className="text-[11px] tracking-[4px] text-cyan-300">
                MINI SIEM
              </p>
            </div>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden lg:flex items-center gap-2 bg-[#020817]/70 border border-cyan-900/30 rounded-full p-1 backdrop-blur-xl">

            {navigationItems.map(
              (item, index) => {
                const isActive =
                  location.pathname ===
                  item.path;

                return (
                  <button
                    key={index}
                    onClick={() =>
                      navigate(item.path)
                    }
                    className={`relative px-6 py-3 rounded-full text-sm transition-all duration-300
                    ${
                      isActive
                        ? "bg-cyan-500/10 text-cyan-300 border border-cyan-500/20 shadow-[0_0_25px_rgba(34,211,238,0.15)]"
                        : "text-gray-400 hover:text-cyan-300 hover:bg-cyan-500/5"
                    }`}
                  >
                    {item.label}
                  </button>
                );
              }
            )}
          </div>

          {/* System Status */}
          <div className="hidden md:flex px-5 py-3 rounded-full bg-green-500/10 border border-green-500/20 items-center gap-3">

            <div className="relative">
              <div className="w-2 h-2 rounded-full bg-green-400"></div>

              <div className="absolute inset-0 w-2 h-2 rounded-full bg-green-400 animate-ping"></div>
            </div>

            <span className="text-green-300 text-sm">
              System Healthy
            </span>
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() =>
              setMobileMenu(
                !mobileMenu
              )
            }
            className="lg:hidden w-11 h-11 rounded-xl border border-cyan-500/20 bg-cyan-500/10 flex items-center justify-center"
          >
            {mobileMenu ? (
              <X size={22} />
            ) : (
              <Menu size={22} />
            )}
          </button>
        </div>

        {/* Mobile Navigation */}
        {mobileMenu && (
          <div className="lg:hidden mt-5 flex flex-col gap-3 border-t border-cyan-500/10 pt-5">

            {navigationItems.map(
              (item, index) => {
                const isActive =
                  location.pathname ===
                  item.path;

                return (
                  <button
                    key={index}
                    onClick={() => {
                      navigate(item.path);
                      setMobileMenu(
                        false
                      );
                    }}
                    className={`w-full text-left px-5 py-4 rounded-2xl transition
                    ${
                      isActive
                        ? "bg-cyan-500/10 border border-cyan-500/20 text-cyan-300"
                        : "bg-[#020817] text-gray-400"
                    }`}
                  >
                    {item.label}
                  </button>
                );
              }
            )}
          </div>
        )}
      </div>
    </nav>
  );
};

export default NavigationBar;