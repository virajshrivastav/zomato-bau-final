import { motion } from "framer-motion";
import { Card } from "@/components/ui/card";

interface LoadingSkeletonProps {
  type?: "leaderboard" | "podium" | "racing" | "card";
  count?: number;
}

/**
 * LoadingSkeleton Component
 *
 * Displays animated loading skeletons for different Live Sprints components.
 * Provides visual feedback while data is loading.
 */
const LoadingSkeleton = ({ type = "leaderboard", count = 1 }: LoadingSkeletonProps) => {
  const pulseAnimation = {
    opacity: [0.5, 1, 0.5],
  };

  const pulseTransition = {
    duration: 1.5,
    repeat: Infinity,
    ease: "easeInOut",
  };

  if (type === "leaderboard") {
    return (
      <div className="flex items-end justify-around gap-4 min-h-[400px]">
        {Array.from({ length: count }).map((_, index) => (
          <motion.div
            key={index}
            className="flex flex-col items-center gap-3"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
          >
            {/* Avatar skeleton */}
            <motion.div
              className="w-16 h-16 rounded-full bg-muted"
              animate={pulseAnimation}
              transition={{ ...pulseTransition, delay: index * 0.1 }}
            />

            {/* Name skeleton */}
            <motion.div
              className="w-24 h-4 rounded bg-muted"
              animate={pulseAnimation}
              transition={{ ...pulseTransition, delay: index * 0.1 + 0.2 }}
            />

            {/* Bar skeleton */}
            <motion.div
              className="w-20 rounded-t-lg bg-muted"
              style={{ height: `${Math.random() * 200 + 100}px` }}
              animate={pulseAnimation}
              transition={{ ...pulseTransition, delay: index * 0.1 + 0.4 }}
            />
          </motion.div>
        ))}
      </div>
    );
  }

  if (type === "podium") {
    return (
      <div className="flex items-end justify-center gap-8">
        {/* 2nd place */}
        <motion.div
          className="flex flex-col items-center gap-3"
          animate={pulseAnimation}
          transition={pulseTransition}
        >
          <div className="w-12 h-12 rounded-full bg-muted" />
          <div className="w-32 h-48 rounded-lg bg-muted" />
        </motion.div>

        {/* 1st place */}
        <motion.div
          className="flex flex-col items-center gap-3"
          animate={pulseAnimation}
          transition={{ ...pulseTransition, delay: 0.2 }}
        >
          <div className="w-16 h-16 rounded-full bg-muted" />
          <div className="w-40 h-64 rounded-lg bg-muted" />
        </motion.div>

        {/* 3rd place */}
        <motion.div
          className="flex flex-col items-center gap-3"
          animate={pulseAnimation}
          transition={{ ...pulseTransition, delay: 0.4 }}
        >
          <div className="w-12 h-12 rounded-full bg-muted" />
          <div className="w-32 h-32 rounded-lg bg-muted" />
        </motion.div>
      </div>
    );
  }

  if (type === "racing") {
    return (
      <div className="space-y-3">
        {Array.from({ length: count }).map((_, index) => (
          <motion.div
            key={index}
            className="space-y-2"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: index * 0.1 }}
          >
            {/* Name skeleton */}
            <div className="flex items-center gap-2">
              <motion.div
                className="w-8 h-4 rounded bg-muted"
                animate={pulseAnimation}
                transition={{ ...pulseTransition, delay: index * 0.1 }}
              />
              <motion.div
                className="w-32 h-4 rounded bg-muted"
                animate={pulseAnimation}
                transition={{ ...pulseTransition, delay: index * 0.1 + 0.1 }}
              />
            </div>

            {/* Track skeleton */}
            <motion.div
              className="h-12 rounded-full bg-muted"
              animate={pulseAnimation}
              transition={{ ...pulseTransition, delay: index * 0.1 + 0.2 }}
            />
          </motion.div>
        ))}
      </div>
    );
  }

  if (type === "card") {
    return (
      <Card className="p-6">
        <motion.div className="space-y-4">
          {/* Header skeleton */}
          <div className="flex items-center justify-between">
            <motion.div
              className="w-32 h-6 rounded bg-muted"
              animate={pulseAnimation}
              transition={pulseTransition}
            />
            <motion.div
              className="w-8 h-8 rounded-full bg-muted"
              animate={pulseAnimation}
              transition={{ ...pulseTransition, delay: 0.1 }}
            />
          </div>

          {/* Value skeleton */}
          <motion.div
            className="w-24 h-10 rounded bg-muted"
            animate={pulseAnimation}
            transition={{ ...pulseTransition, delay: 0.2 }}
          />
        </motion.div>
      </Card>
    );
  }

  return null;
};

export default LoadingSkeleton;
