import { ArrowUp, ArrowDown, Minus } from "lucide-react";
import { cn } from "@/lib/utils";

interface RankMovementProps {
  rankChange: number;
  className?: string;
  showText?: boolean;
}

/**
 * RankMovement Component
 *
 * Displays rank change with appropriate icon and color
 * - Positive change (moved up in rank) = Green with up arrow
 * - Negative change (moved down in rank) = Red with down arrow
 * - No change = Gray with minus
 *
 * Note: In rankings, lower number = better rank
 * So rankChange = previous_rank - current_rank
 * Positive rankChange means improvement (e.g., from rank 5 to rank 3 = +2)
 */
export function RankMovement({ rankChange, className, showText = true }: RankMovementProps) {
  // No change
  if (rankChange === 0) {
    return (
      <div className={cn("flex items-center gap-1 text-muted-foreground", className)}>
        <Minus className="h-3 w-3" />
        {showText && <span className="text-xs">No change</span>}
      </div>
    );
  }

  // Improved (moved up in rank)
  if (rankChange > 0) {
    return (
      <div className={cn("flex items-center gap-1 text-green-600", className)}>
        <ArrowUp className="h-3 w-3" />
        {showText && (
          <span className="text-xs font-medium">
            ↑ {rankChange} {rankChange === 1 ? "rank" : "ranks"}
          </span>
        )}
      </div>
    );
  }

  // Declined (moved down in rank)
  return (
    <div className={cn("flex items-center gap-1 text-red-600", className)}>
      <ArrowDown className="h-3 w-3" />
      {showText && (
        <span className="text-xs font-medium">
          ↓ {Math.abs(rankChange)} {Math.abs(rankChange) === 1 ? "rank" : "ranks"}
        </span>
      )}
    </div>
  );
}

interface RankBadgeProps {
  rank: number | null;
  rankChange?: number;
  className?: string;
}

/**
 * RankBadge Component
 *
 * Displays rank number with optional movement indicator
 */
export function RankBadge({ rank, rankChange, className }: RankBadgeProps) {
  if (rank === null) {
    return <div className={cn("text-sm text-muted-foreground", className)}>N/A</div>;
  }

  const getRankColor = (rank: number) => {
    if (rank === 1) return "text-yellow-600 font-bold"; // Gold
    if (rank === 2) return "text-gray-500 font-bold"; // Silver
    if (rank === 3) return "text-orange-600 font-bold"; // Bronze
    if (rank <= 10) return "text-blue-600 font-semibold";
    return "text-foreground";
  };

  return (
    <div className={cn("flex items-center gap-2", className)}>
      <span className={cn("text-lg", getRankColor(rank))}>#{rank}</span>
      {rankChange !== undefined && rankChange !== 0 && (
        <RankMovement rankChange={rankChange} showText={false} />
      )}
    </div>
  );
}

interface PerformanceChangeProps {
  change: number;
  isPercentage?: boolean;
  className?: string;
}

/**
 * PerformanceChange Component
 *
 * Displays performance metric change (e.g., +3.2%, -1.8%)
 * Used for showing metric value changes, not rank changes
 */
export function PerformanceChange({
  change,
  isPercentage = true,
  className,
}: PerformanceChangeProps) {
  if (change === 0) {
    return (
      <span className={cn("text-xs text-muted-foreground", className)}>
        0{isPercentage ? "%" : ""}
      </span>
    );
  }

  const isPositive = change > 0;
  const displayValue = Math.abs(change).toFixed(1);

  return (
    <span
      className={cn(
        "text-xs font-medium",
        isPositive ? "text-green-600" : "text-red-600",
        className
      )}
    >
      {isPositive ? "+" : "-"}
      {displayValue}
      {isPercentage ? "%" : ""}
    </span>
  );
}
