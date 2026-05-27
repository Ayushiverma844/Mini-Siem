// src/components/ModuleCards.jsx

import { useNavigate } from "react-router-dom";

const ModuleCards = () => {
  const navigate = useNavigate();

  const modules = [
    {
      title:
        "Email Threat Intelligence",
      description:
        "Analyze suspicious emails and identify phishing attempts with AI-powered threat detection.",
      icon: "📧",
      buttonText: "Open Module",
      route: "/email-analysis",
    },
    {
      title:
        "Security Log Analyzer",
      description:
        "Upload log files and detect malicious activity, attacks, and unusual behavior instantly.",
      icon: "🛡️",
      buttonText: "Open Module",
      route: "/log-analysis",
    },
  ];

  return (
    <div className="grid lg:grid-cols-2 gap-6 mt-12">
      {modules.map(
        (module, index) => (
          <div
            key={index}
            onClick={() =>
              navigate(module.route)
            }
            className="group relative overflow-hidden rounded-[30px] border border-cyan-500/10 bg-[#07101f]/90 p-7 cursor-pointer transition-all duration-500 hover:border-cyan-400/40 hover:-translate-y-2 hover:shadow-[0_0_60px_rgba(34,211,238,0.15)]"
          >
            {/* Animated Glow Background */}
            <div className="absolute -top-16 -right-16 w-48 h-48 bg-cyan-500/10 blur-[100px] rounded-full group-hover:bg-cyan-500/20 transition duration-700"></div>

            {/* Scanner Moving Line */}
            <div className="absolute top-0 left-[-100%] w-[120%] h-[2px] bg-gradient-to-r from-transparent via-cyan-400 to-transparent group-hover:left-full transition-all duration-[1800ms]"></div>

            {/* Subtle Animated Border */}
            <div className="absolute inset-0 rounded-[30px] border border-cyan-400/0 group-hover:border-cyan-400/20 transition-all duration-500"></div>

            <div className="relative z-10">

              {/* Icon */}
              <div className="w-16 h-16 rounded-[22px] bg-cyan-500/10 border border-cyan-500/20 flex items-center justify-center text-3xl mb-6 transition-transform duration-500 group-hover:scale-110">
                {module.icon}
              </div>

              {/* Title */}
              <h2 className="text-2xl font-semibold">
                {module.title}
              </h2>

              {/* Description */}
              <p className="text-gray-400 mt-4 leading-7">
                {module.description}
              </p>

              {/* Footer */}
              <div className="mt-8 flex items-center justify-between">

                <span className="text-cyan-300 font-medium">
                  {
                    module.buttonText
                  }
                </span>

                <div className="w-11 h-11 rounded-full border border-cyan-500/20 bg-cyan-500/5 flex items-center justify-center transition-all duration-300 group-hover:translate-x-2 group-hover:border-cyan-400/40 group-hover:bg-cyan-500/10">
                  →
                </div>
              </div>
            </div>
          </div>
        )
      )}
    </div>
  );
};

export default ModuleCards;