import { motion } from "framer-motion";

function AnimatedBackground() {
  return (
    <div className="absolute inset-0 overflow-hidden">

      <motion.div
        animate={{
          x: [0, 100, 0],
          y: [0, 50, 0]
        }}
        transition={{
          duration: 12,
          repeat: Infinity
        }}
        className="absolute top-20 left-20 w-96 h-96 bg-cyan-500/10 blur-[120px] rounded-full"
      />

      <motion.div
        animate={{
          x: [0, -100, 0],
          y: [0, -50, 0]
        }}
        transition={{
          duration: 10,
          repeat: Infinity
        }}
        className="absolute bottom-20 right-20 w-96 h-96 bg-emerald-500/10 blur-[120px] rounded-full"
      />
    </div>
  );
}

export default AnimatedBackground;