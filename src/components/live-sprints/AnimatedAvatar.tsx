import { motion } from "framer-motion";
import winnerAvatar from "@/assets/avatar-winner.png";
import determinedAvatar from "@/assets/avatar-determined.png";
import runningAvatar from "@/assets/avatar-running.png";
import tiredAvatar from "@/assets/avatar-tired.png";

interface AnimatedAvatarProps {
  rank: number;
  totalRanks: number;
  name: string;
}

/**
 * AnimatedAvatar Component
 * Displays animated avatar based on rank with Framer Motion effects
 * Future: Will be replaced with Lottie animations
 */
const AnimatedAvatar = ({ rank, totalRanks, name }: AnimatedAvatarProps) => {
  const getAvatar = () => {
    if (rank === 1) return winnerAvatar;
    if (rank === 2 || rank === 3) return determinedAvatar;
    if (rank === totalRanks) return tiredAvatar;
    return runningAvatar;
  };

  const getAnimationVariants = () => {
    if (rank === 1) {
      // Winner: Bounce animation
      return {
        initial: { scale: 0, rotate: -180 },
        animate: {
          scale: 1,
          rotate: 0,
          transition: {
            type: "spring",
            stiffness: 260,
            damping: 20,
            delay: 0.2,
          },
        },
        hover: {
          scale: 1.2,
          rotate: [0, -10, 10, -10, 0],
          transition: {
            rotate: {
              repeat: Infinity,
              duration: 0.5,
            },
          },
        },
      };
    } else if (rank <= 3) {
      // Top 3: Spring animation
      return {
        initial: { scale: 0, y: -50 },
        animate: {
          scale: 1,
          y: 0,
          transition: {
            type: "spring",
            stiffness: 200,
            damping: 15,
            delay: rank * 0.1,
          },
        },
        hover: {
          scale: 1.15,
          y: -5,
        },
      };
    } else {
      // Others: Fade in
      return {
        initial: { opacity: 0, scale: 0.8 },
        animate: {
          opacity: 1,
          scale: 1,
          transition: {
            duration: 0.4,
            delay: rank * 0.05,
          },
        },
        hover: {
          scale: 1.1,
        },
      };
    }
  };

  const variants = getAnimationVariants();

  return (
    <motion.div
      className="relative"
      initial="initial"
      animate="animate"
      whileHover="hover"
      variants={variants}
    >
      <motion.img
        src={getAvatar()}
        alt={name}
        className="w-16 h-16 rounded-full border-4 border-card shadow-lg"
        style={{
          filter: rank === 1 ? "drop-shadow(0 0 10px rgba(255, 215, 0, 0.6))" : "none",
        }}
      />

      {/* Glow effect for top 3 */}
      {rank <= 3 && (
        <motion.div
          className="absolute inset-0 rounded-full"
          animate={{
            boxShadow: [
              `0 0 20px ${rank === 1 ? "rgba(255, 215, 0, 0.4)" : rank === 2 ? "rgba(192, 192, 192, 0.4)" : "rgba(205, 127, 50, 0.4)"}`,
              `0 0 40px ${rank === 1 ? "rgba(255, 215, 0, 0.8)" : rank === 2 ? "rgba(192, 192, 192, 0.8)" : "rgba(205, 127, 50, 0.8)"}`,
              `0 0 20px ${rank === 1 ? "rgba(255, 215, 0, 0.4)" : rank === 2 ? "rgba(192, 192, 192, 0.4)" : "rgba(205, 127, 50, 0.4)"}`,
            ],
          }}
          transition={{
            duration: 2,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        />
      )}
    </motion.div>
  );
};

export default AnimatedAvatar;
