import { motion } from "framer-motion";

/**
 * LiveIndicator Component
 * Displays a pulsing "LIVE" badge to indicate real-time updates
 */
const LiveIndicator = () => {
  return (
    <div className="flex items-center gap-2">
      {/* Pulsing red dot */}
      <motion.div
        className="relative w-3 h-3"
        animate={{
          scale: [1, 1.2, 1],
        }}
        transition={{
          duration: 1.5,
          repeat: Infinity,
          ease: "easeInOut",
        }}
      >
        <div className="absolute inset-0 bg-red-500 rounded-full" />
        <motion.div
          className="absolute inset-0 bg-red-500 rounded-full"
          animate={{
            scale: [1, 2, 2],
            opacity: [0.8, 0, 0],
          }}
          transition={{
            duration: 1.5,
            repeat: Infinity,
            ease: "easeOut",
          }}
        />
      </motion.div>

      {/* LIVE text */}
      <motion.span
        className="text-sm font-bold text-red-500 uppercase tracking-wider"
        animate={{
          opacity: [1, 0.7, 1],
        }}
        transition={{
          duration: 1.5,
          repeat: Infinity,
          ease: "easeInOut",
        }}
      >
        LIVE
      </motion.span>
    </div>
  );
};

export default LiveIndicator;
