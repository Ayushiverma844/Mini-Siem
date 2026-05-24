import { motion } from "framer-motion";

function StatusCard({
  title,
  value,
  icon,
  description
}) {
  return (
    <motion.div
      whileHover={{
        scale: 1.03
      }}
      transition={{
        duration: 0.3
      }}
      className="
      relative overflow-hidden
      rounded-3xl
      border border-cyan-500/20
      bg-white/5
      backdrop-blur-2xl
      p-6
      shadow-xl
      "
    >
      <div className="absolute inset-0 bg-gradient-to-br from-cyan-500/10 to-emerald-500/10" />

      <div className="relative z-10 flex justify-between items-start">

        <div>
          <p className="text-gray-400 text-sm mb-2">
            {title}
          </p>

          <h2 className="text-4xl font-bold text-white">
            {value}
          </h2>

          <p className="text-sm text-emerald-400 mt-2">
            {description}
          </p>
        </div>

        <div className="
        p-4 rounded-2xl
        bg-gradient-to-r
        from-cyan-500/20
        to-emerald-500/20
        border border-cyan-500/20
        ">
          {icon}
        </div>

      </div>
    </motion.div>
  );
}

export default StatusCard;