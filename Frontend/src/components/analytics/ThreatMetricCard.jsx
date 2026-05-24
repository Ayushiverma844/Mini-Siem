import { motion } from "framer-motion";

const ThreatMetricCard = ({
  title,
  value,
  icon,
  subtitle,
  glowColor = "from-cyan-500/20 to-emerald-500/20",
}) => {
  return (
    <motion.div
      whileHover={{ y: -6 }}
      transition={{ duration: 0.25 }}
      className="
        relative overflow-hidden
        rounded-3xl
        border border-white/10
        bg-white/5
        backdrop-blur-xl
        p-5
        shadow-xl
      "
    >
      {/* Background Gradient */}
      <div
        className={`
          absolute inset-0 opacity-10
          bg-gradient-to-br ${glowColor}
        `}
      />

      {/* Content */}
      <div className="relative z-10 flex items-start justify-between">
        {/* Left Side */}
        <div>
          <p className="text-sm text-slate-400 font-medium">
            {title}
          </p>

          <h3 className="mt-3 text-3xl font-bold text-white">
            {value}
          </h3>

          <p className="mt-2 text-sm text-slate-400">
            {subtitle}
          </p>
        </div>

        {/* Icon */}
        <div
          className="
            flex items-center justify-center
            w-14 h-14
            rounded-2xl
            bg-gradient-to-br
            from-cyan-500/20
            to-emerald-500/20
            border border-cyan-400/20
          "
        >
          {icon}
        </div>
      </div>

      {/* Bottom Glow */}
      <div
        className="
          absolute bottom-0 left-0
          w-full h-[2px]
          bg-gradient-to-r
          from-cyan-400
          via-emerald-400
          to-transparent
        "
      />
    </motion.div>
  );
};

export default ThreatMetricCard;