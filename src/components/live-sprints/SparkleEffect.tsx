import { motion } from "framer-motion";

interface SparkleEffectProps {
  count?: number;
  color?: string;
}

/**
 * SparkleEffect Component
 * Creates animated sparkle particles around an element
 */
const SparkleEffect = ({ count = 5, color = "#FFD700" }: SparkleEffectProps) => {
  const sparkles = Array.from({ length: count }, (_, i) => i);

  return (
    <div className="absolute inset-0 pointer-events-none">
      {sparkles.map((i) => {
        const angle = (360 / count) * i;
        const radius = 40;
        const x = Math.cos((angle * Math.PI) / 180) * radius;
        const y = Math.sin((angle * Math.PI) / 180) * radius;

        return (
          <motion.div
            key={i}
            className="absolute top-1/2 left-1/2"
            style={{
              width: 8,
              height: 8,
            }}
            initial={{
              x: 0,
              y: 0,
              scale: 0,
              opacity: 0,
            }}
            animate={{
              x: [0, x, 0],
              y: [0, y, 0],
              scale: [0, 1, 0],
              opacity: [0, 1, 0],
              rotate: [0, 180, 360],
            }}
            transition={{
              duration: 2,
              repeat: Infinity,
              delay: i * 0.2,
              ease: "easeInOut",
            }}
          >
            <svg viewBox="0 0 24 24" fill={color} className="w-full h-full">
              <path d="M12 0L14.59 9.41L24 12L14.59 14.59L12 24L9.41 14.59L0 12L9.41 9.41L12 0Z" />
            </svg>
          </motion.div>
        );
      })}
    </div>
  );
};

export default SparkleEffect;
