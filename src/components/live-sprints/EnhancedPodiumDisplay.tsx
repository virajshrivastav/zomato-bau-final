import { motion } from "framer-motion";
import { Trophy, Medal, Award } from "lucide-react";
import { Card } from "@/components/ui/card";
import { useEffect, useState } from "react";
import confetti from "canvas-confetti";
import AnimatedNumber from "./AnimatedNumber";
import SparkleEffect from "./SparkleEffect";

interface PodiumProps {
  first: { name: string; achievement: number; zone: string };
  second: { name: string; achievement: number; zone: string };
  third: { name: string; achievement: number; zone: string };
}

const EnhancedPodiumDisplay = ({ first, second, third }: PodiumProps) => {
  const [showConfetti, setShowConfetti] = useState(false);

  useEffect(() => {
    // Trigger confetti after podium animation
    const timer = setTimeout(() => {
      setShowConfetti(true);
      triggerConfetti();
    }, 1500);

    return () => clearTimeout(timer);
  }, []);

  const triggerConfetti = () => {
    const duration = 3000;
    const animationEnd = Date.now() + duration;
    const defaults = { startVelocity: 30, spread: 360, ticks: 60, zIndex: 0 };

    const randomInRange = (min: number, max: number) => {
      return Math.random() * (max - min) + min;
    };

    const interval = setInterval(() => {
      const timeLeft = animationEnd - Date.now();

      if (timeLeft <= 0) {
        return clearInterval(interval);
      }

      const particleCount = 50 * (timeLeft / duration);

      confetti({
        ...defaults,
        particleCount,
        origin: { x: randomInRange(0.1, 0.3), y: Math.random() - 0.2 },
        colors: ["#FFD700", "#FFA500", "#FF6347"],
      });
      confetti({
        ...defaults,
        particleCount,
        origin: { x: randomInRange(0.7, 0.9), y: Math.random() - 0.2 },
        colors: ["#FFD700", "#FFA500", "#FF6347"],
      });
    }, 250);
  };

  const podiumVariants = {
    hidden: { y: 100, opacity: 0 },
    visible: (custom: number) => ({
      y: 0,
      opacity: 1,
      transition: {
        type: "spring",
        stiffness: 100,
        damping: 15,
        delay: custom * 0.2,
      },
    }),
  };

  return (
    <div className="mb-12">
      <motion.h2
        className="text-3xl font-bold text-center mb-8 flex items-center justify-center gap-3"
        initial={{ scale: 0, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ type: "spring", stiffness: 200, delay: 0.2 }}
      >
        <motion.div
          animate={{ rotate: [0, -10, 10, -10, 0] }}
          transition={{ duration: 0.5, repeat: Infinity, repeatDelay: 2 }}
        >
          <Trophy className="w-8 h-8 text-gold" />
        </motion.div>
        Top Performers
        <motion.div
          animate={{ rotate: [0, 10, -10, 10, 0] }}
          transition={{ duration: 0.5, repeat: Infinity, repeatDelay: 2 }}
        >
          <Trophy className="w-8 h-8 text-gold" />
        </motion.div>
      </motion.h2>

      <div className="flex items-end justify-center gap-4 max-w-4xl mx-auto">
        {/* Second Place */}
        <motion.div
          custom={1}
          variants={podiumVariants}
          initial="hidden"
          animate="visible"
          className="flex-1"
        >
          <Card className="p-6 bg-gradient-to-b from-silver/10 to-transparent border-silver/30 relative overflow-hidden">
            <motion.div
              whileHover={{ scale: 1.05 }}
              transition={{ type: "spring", stiffness: 300 }}
              className="text-center"
            >
              <Medal className="w-12 h-12 text-silver mx-auto mb-3" fill="currentColor" />
              <div className="text-6xl font-bold text-silver mb-2">2</div>
              <div className="text-xl font-bold text-foreground mb-1">{second.name}</div>
              <div className="text-sm text-muted-foreground mb-2">{second.zone}</div>
              <div className="text-3xl font-bold text-silver">
                <AnimatedNumber value={second.achievement} suffix="%" />
              </div>
            </motion.div>
          </Card>
        </motion.div>

        {/* First Place */}
        <motion.div
          custom={0}
          variants={podiumVariants}
          initial="hidden"
          animate="visible"
          className="flex-1 relative"
        >
          {/* Sparkle effects around winner */}
          <SparkleEffect count={8} color="#FFD700" />

          <Card className="p-8 bg-gradient-to-b from-gold/20 to-transparent border-gold/40 transform scale-110 shadow-2xl relative overflow-hidden">
            <motion.div
              whileHover={{ scale: 1.05 }}
              transition={{ type: "spring", stiffness: 300 }}
              className="text-center"
            >
              <motion.div
                animate={{ y: [0, -10, 0] }}
                transition={{ duration: 1, repeat: Infinity, ease: "easeInOut" }}
              >
                <Trophy className="w-16 h-16 text-gold mx-auto mb-4" fill="currentColor" />
              </motion.div>
              <div className="text-7xl font-bold text-gold mb-2">1</div>
              <div className="text-2xl font-bold text-foreground mb-1">{first.name}</div>
              <div className="text-sm text-muted-foreground mb-3">{first.zone}</div>
              <div className="text-4xl font-bold text-gold">
                <AnimatedNumber value={first.achievement} suffix="%" />
              </div>
            </motion.div>
          </Card>
        </motion.div>

        {/* Third Place */}
        <motion.div
          custom={2}
          variants={podiumVariants}
          initial="hidden"
          animate="visible"
          className="flex-1"
        >
          <Card className="p-6 bg-gradient-to-b from-bronze/10 to-transparent border-bronze/30 relative overflow-hidden">
            <motion.div
              whileHover={{ scale: 1.05 }}
              transition={{ type: "spring", stiffness: 300 }}
              className="text-center"
            >
              <Award className="w-12 h-12 text-bronze mx-auto mb-3" fill="currentColor" />
              <div className="text-6xl font-bold text-bronze mb-2">3</div>
              <div className="text-xl font-bold text-foreground mb-1">{third.name}</div>
              <div className="text-sm text-muted-foreground mb-2">{third.zone}</div>
              <div className="text-3xl font-bold text-bronze">
                <AnimatedNumber value={third.achievement} suffix="%" />
              </div>
            </motion.div>
          </Card>
        </motion.div>
      </div>
    </div>
  );
};

export default EnhancedPodiumDisplay;
