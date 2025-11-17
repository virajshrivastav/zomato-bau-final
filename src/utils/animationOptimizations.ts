/**
 * Animation Optimization Utilities
 *
 * Helper functions and constants for optimizing Framer Motion animations.
 * Ensures smooth 60fps performance across all devices.
 */

/**
 * GPU-Accelerated Properties
 *
 * These CSS properties trigger GPU acceleration for better performance.
 * Always prefer these over layout-triggering properties.
 */
export const GPU_PROPERTIES = ["transform", "opacity", "filter"] as const;

/**
 * Layout-Triggering Properties (AVOID)
 *
 * These properties cause layout recalculation and should be avoided in animations.
 */
export const LAYOUT_PROPERTIES = [
  "width",
  "height",
  "top",
  "left",
  "right",
  "bottom",
  "margin",
  "padding",
] as const;

/**
 * Optimized Spring Configuration
 *
 * Pre-configured spring physics for different animation types.
 */
export const SPRING_CONFIGS = {
  // Gentle, smooth animations
  gentle: {
    type: "spring" as const,
    stiffness: 100,
    damping: 20,
  },

  // Snappy, responsive animations
  snappy: {
    type: "spring" as const,
    stiffness: 300,
    damping: 30,
  },

  // Bouncy, playful animations
  bouncy: {
    type: "spring" as const,
    stiffness: 260,
    damping: 15,
  },

  // Slow, dramatic animations
  slow: {
    type: "spring" as const,
    stiffness: 50,
    damping: 25,
  },
} as const;

/**
 * Optimized Transition Configuration
 *
 * Pre-configured transitions for common animation patterns.
 */
export const TRANSITIONS = {
  // Fast fade
  fade: {
    duration: 0.2,
    ease: "easeInOut" as const,
  },

  // Medium slide
  slide: {
    duration: 0.3,
    ease: "easeOut" as const,
  },

  // Slow scale
  scale: {
    duration: 0.4,
    ease: "easeInOut" as const,
  },
} as const;

/**
 * Stagger Configuration
 *
 * Helper function to create staggered animation delays.
 */
export const createStagger = (index: number, baseDelay = 0, staggerDelay = 0.1) => {
  return baseDelay + index * staggerDelay;
};

/**
 * Viewport Configuration
 *
 * Optimized viewport settings for scroll-triggered animations.
 */
export const VIEWPORT_CONFIG = {
  once: true, // Only animate once when entering viewport
  margin: "0px 0px -100px 0px", // Start animation slightly before element is visible
  amount: 0.3, // Trigger when 30% of element is visible
} as const;

/**
 * Performance Hints
 *
 * CSS properties to hint the browser about upcoming animations.
 */
export const getPerformanceHints = (properties: string[]) => {
  return {
    willChange: properties.join(", "),
  };
};

/**
 * Throttle Animation Frame
 *
 * Throttles a function to run at most once per animation frame.
 */
export const throttleAnimationFrame = <T extends (...args: any[]) => void>(
  callback: T
): ((...args: Parameters<T>) => void) => {
  let rafId: number | null = null;

  return (...args: Parameters<T>) => {
    if (rafId !== null) {
      return;
    }

    rafId = requestAnimationFrame(() => {
      callback(...args);
      rafId = null;
    });
  };
};

/**
 * Debounce
 *
 * Debounces a function to run after a delay.
 */
export const debounce = <T extends (...args: any[]) => void>(
  callback: T,
  delay: number
): ((...args: Parameters<T>) => void) => {
  let timeoutId: NodeJS.Timeout | null = null;

  return (...args: Parameters<T>) => {
    if (timeoutId) {
      clearTimeout(timeoutId);
    }

    timeoutId = setTimeout(() => {
      callback(...args);
      timeoutId = null;
    }, delay);
  };
};

/**
 * Check if device prefers reduced motion
 */
export const prefersReducedMotion = (): boolean => {
  if (typeof window === "undefined") return false;
  return window.matchMedia("(prefers-reduced-motion: reduce)").matches;
};

/**
 * Get optimized animation config based on device capabilities
 */
export const getOptimizedConfig = () => {
  const isLowEnd = typeof navigator !== "undefined" && (navigator.hardwareConcurrency || 0) < 4;

  const reducedMotion = prefersReducedMotion();

  return {
    isLowEnd,
    reducedMotion,
    particleCount: isLowEnd ? 5 : reducedMotion ? 0 : 15,
    animationDuration: reducedMotion ? 0 : isLowEnd ? 0.5 : 1,
    enableComplexAnimations: !isLowEnd && !reducedMotion,
  };
};
