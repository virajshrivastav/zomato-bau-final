import { motion, useSpring, useTransform } from "framer-motion";
import { useEffect } from "react";

interface AnimatedNumberProps {
  value: number;
  suffix?: string;
  className?: string;
  duration?: number;
}

/**
 * AnimatedNumber Component
 * Displays numbers with smooth counting animation (odometer effect)
 */
const AnimatedNumber = ({
  value,
  suffix = "",
  className = "",
  duration = 1,
}: AnimatedNumberProps) => {
  const spring = useSpring(0, {
    stiffness: 100,
    damping: 30,
    duration: duration * 1000,
  });

  const display = useTransform(spring, (current) => Math.round(current).toLocaleString());

  useEffect(() => {
    spring.set(value);
  }, [spring, value]);

  return (
    <motion.span
      className={className}
      initial={{ scale: 0.8, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      transition={{ duration: 0.3 }}
    >
      <motion.span>{display}</motion.span>
      {suffix}
    </motion.span>
  );
};

export default AnimatedNumber;
