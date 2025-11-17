import { motion } from "framer-motion";
import { Medal } from "lucide-react";
import AnimatedAvatar from "./AnimatedAvatar";
import AnimatedNumber from "./AnimatedNumber";
import SparkleEffect from "./SparkleEffect";

interface EnhancedLeaderboardBarProps {
  name: string;
  zone: string;
  achievement: number;
  rank: number;
  totalRanks: number;
}

const EnhancedLeaderboardBar = ({
  name,
  zone,
  achievement,
  rank,
  totalRanks,
}: EnhancedLeaderboardBarProps) => {
  const getBarColor = () => {
    switch (rank) {
      case 1:
        return "from-gold to-yellow-400";
      case 2:
        return "from-silver to-gray-300";
      case 3:
        return "from-bronze to-orange-400";
      default:
        return "from-race-blue to-blue-400";
    }
  };

  const getMedalColor = () => {
    switch (rank) {
      case 1:
        return "text-gold";
      case 2:
        return "text-silver";
      case 3:
        return "text-bronze";
      default:
        return "text-muted-foreground";
    }
  };

  const getPodiumHeight = () => {
    if (rank === 1) return "h-16";
    if (rank === 2) return "h-12";
    if (rank === 3) return "h-8";
    return "h-0";
  };

  return (
    <motion.div
      className="flex flex-col items-center group relative"
      initial={{ opacity: 0, y: 50, scale: 0.8 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{
        type: "spring",
        stiffness: 100,
        damping: 15,
        delay: rank * 0.1,
      }}
      whileHover={{
        scale: 1.05,
        zIndex: 10,
        transition: { duration: 0.2 },
      }}
    >
      {/* Sparkle effect for top 3 */}
      {rank <= 3 && <SparkleEffect count={6} />}

      {/* Avatar at top */}
      <div className="relative mb-2">
        <AnimatedAvatar rank={rank} totalRanks={totalRanks} name={name} />

        {rank <= 3 && (
          <motion.div
            className="absolute -top-2 -right-2 bg-card rounded-full p-1 shadow-md"
            initial={{ scale: 0, rotate: -180 }}
            animate={{ scale: 1, rotate: 0 }}
            transition={{
              type: "spring",
              stiffness: 200,
              delay: rank * 0.1 + 0.3,
            }}
            whileHover={{
              scale: 1.2,
              rotate: 360,
              transition: { duration: 0.5 },
            }}
          >
            <Medal className={`w-5 h-5 ${getMedalColor()}`} fill="currentColor" />
          </motion.div>
        )}
      </div>

      {/* Achievement percentage above bar */}
      <motion.div
        className="mb-1 font-bold text-foreground text-lg"
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{
          type: "spring",
          stiffness: 200,
          delay: rank * 0.1 + 0.2,
        }}
      >
        <AnimatedNumber value={achievement} suffix="%" />
      </motion.div>

      {/* Vertical Bar */}
      <div className="relative w-20 h-64 bg-muted/50 rounded-t-xl overflow-hidden border-2 border-border shadow-inner">
        <motion.div
          className={`absolute bottom-0 w-full bg-gradient-to-t ${getBarColor()} rounded-t-xl shadow-lg`}
          initial={{ height: "0%" }}
          animate={{ height: `${achievement}%` }}
          transition={{
            duration: 1.5,
            ease: [0.34, 1.56, 0.64, 1],
            delay: rank * 0.15,
          }}
        >
          {/* Shine effect */}
          <motion.div
            className="absolute inset-0 bg-gradient-to-t from-transparent to-white/20"
            animate={{
              opacity: [0.3, 0.6, 0.3],
            }}
            transition={{
              duration: 2,
              repeat: Infinity,
              ease: "easeInOut",
            }}
          />
        </motion.div>
      </div>

      {/* Podium for top 3 */}
      {rank <= 3 && (
        <motion.div
          className={`w-24 ${getPodiumHeight()} bg-gradient-to-b ${getBarColor()} rounded-b-lg border-2 border-border shadow-md`}
          initial={{ height: 0, opacity: 0 }}
          animate={{ height: "auto", opacity: 1 }}
          transition={{
            duration: 0.5,
            delay: rank * 0.15 + 1.5,
          }}
        />
      )}

      {/* Name and Zone */}
      <motion.div
        className="mt-3 text-center"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: rank * 0.1 + 0.5 }}
      >
        <div className="font-semibold text-foreground text-sm">{name}</div>
        <div className="text-xs text-muted-foreground">{zone}</div>
      </motion.div>
    </motion.div>
  );
};

export default EnhancedLeaderboardBar;
