// src/components/WelcomePanel.jsx

import { useNavigate } from "react-router-dom";
const WelcomePanel = ({
  onStartAnalysis,
  onViewReports,
}) => {
  const navigate = useNavigate();

  return (
    <div className="grid lg:grid-cols-2 gap-10 items-center mt-10">
      {/* Left Content Area */}
      <div>
        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-cyan-500/20 bg-cyan-500/10 mb-6 backdrop-blur-md">
          <div className="w-2 h-2 rounded-full bg-cyan-400 animate-pulse"></div>

          <span className="text-cyan-300 text-sm tracking-wide">
            AI Powered Threat Detection
          </span>
        </div>

        <h1 className="text-5xl lg:text-6xl font-bold leading-tight">
          Cybersecurity
          <br />
          Intelligence
          <br />
          Dashboard
        </h1>

        <p className="text-gray-400 mt-5 text-lg leading-8 max-w-xl">
          Advanced phishing email detection and security log
          analysis powered by machine learning. Protect your
          infrastructure with real-time threat intelligence.
        </p>

         <div className="flex gap-4 mt-8">
  <button
    onClick={onStartAnalysis}
    className="px-7 py-4 rounded-2xl bg-cyan-500 hover:bg-cyan-400 transition text-black font-semibold"
  >
    Start Analysis
  </button>

  <button
    onClick={onViewReports}
    className="px-7 py-4 rounded-2xl border border-cyan-500/30 bg-cyan-500/10 hover:bg-cyan-500/20 transition"
  >
    View Reports
  </button>
</div>
      </div>

      {/* Right Scanner Animation Area */}
      <div className="flex justify-center items-center">
        <div className="relative w-[360px] h-[360px] flex items-center justify-center">

          {/* Background Glow */}
          <div className="absolute w-[340px] h-[340px] bg-cyan-500/10 rounded-full blur-[120px]"></div>

          {/* Rotating Scanner Ring */}
          <div className="absolute w-[320px] h-[320px] rounded-full border border-cyan-500/20 animate-spin-slow"></div>

          {/* Outer Circle */}
          <div className="absolute w-[300px] h-[300px] rounded-full border border-cyan-500/20"></div>

          {/* Middle Circle */}
          <div className="absolute w-[230px] h-[230px] rounded-full border border-cyan-400/20"></div>

          {/* Inner Circle */}
          <div className="absolute w-[170px] h-[170px] rounded-full border border-cyan-300/20"></div>

          {/* Scanner Beam */}
          <div className="scanner-beam"></div>

          {/* Floating Data Points */}
          <div className="absolute top-10 left-16 w-3 h-3 bg-cyan-400 rounded-full animate-ping"></div>

          <div className="absolute bottom-14 right-16 w-2 h-2 bg-cyan-300 rounded-full animate-pulse"></div>

          <div className="absolute top-24 right-10 w-2 h-2 bg-cyan-500 rounded-full animate-bounce"></div>

          {/* Rotating Dashed Ring */}
          <div className="absolute w-[270px] h-[270px] rounded-full border border-dashed border-cyan-400/20 animate-spin-reverse"></div>

          {/* Center Core */}
          <div className="relative z-20 w-[145px] h-[145px] rounded-full bg-cyan-500/10 border border-cyan-400/30 flex items-center justify-center shadow-[0_0_80px_rgba(34,211,238,0.45)] backdrop-blur-md">

            {/* Pulse Effect */}
            <div className="absolute w-full h-full rounded-full bg-cyan-400/10 animate-ping"></div>

            <div className="text-center z-10">
              <h2 className="text-cyan-300 text-3xl font-bold tracking-wider">
                SIEM
              </h2>

              <p className="text-xs text-gray-400 mt-1 tracking-[3px]">
                THREAT ENGINE
              </p>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
};

export default WelcomePanel;