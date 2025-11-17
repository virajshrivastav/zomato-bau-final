import { Card, CardContent } from "@/components/ui/card";
import { LucideIcon } from "lucide-react";
import { cn } from "@/lib/utils";
import { Progress } from "@/components/ui/progress";

interface MetricCardProps {
  title: string;
  value: string | number;
  icon: LucideIcon;
  variant?: "primary" | "success" | "warning" | "default";
  progress?: number;
  description?: string;
}

export const MetricCard = ({
  title,
  value,
  icon: Icon,
  variant = "default",
  progress,
  description,
}: MetricCardProps) => {
  // Determine icon background and text color based on variant
  const variantStyles = {
    primary: "bg-primary/10 text-primary",
    success: "bg-[hsl(var(--status-success))]/10 text-[hsl(var(--status-success))]",
    warning: "bg-[hsl(var(--status-warning))]/10 text-[hsl(var(--status-warning))]",
    default: "bg-muted text-muted-foreground",
  };

  const decorativeCircleStyles = {
    primary: "bg-primary/5",
    success: "bg-[hsl(var(--status-success))]/5",
    warning: "bg-[hsl(var(--status-warning))]/5",
    default: "bg-muted/50",
  };

  return (
    <Card className="overflow-hidden relative hover:shadow-lg transition-all duration-300 hover:-translate-y-1 h-full">
      {/* Decorative circle - top right */}
      <div
        className={cn(
          "absolute top-0 right-0 w-32 h-32 rounded-full -mr-16 -mt-16",
          decorativeCircleStyles[variant]
        )}
      />

      <CardContent className="p-4 sm:p-6 relative h-full flex flex-col">
        {/* Icon in colored circle */}
        <div className="flex items-center justify-between mb-3 sm:mb-4">
          <div className={cn("p-2 rounded-lg", variantStyles[variant])}>
            <Icon className="w-4 h-4 sm:w-5 sm:h-5" />
          </div>
        </div>

        {/* Title and Value */}
        <div className="flex-1">
          <p className="text-xs sm:text-sm text-muted-foreground mb-1 leading-tight">{title}</p>
          <p className="text-xl sm:text-2xl font-bold leading-tight break-words">{value}</p>
          {description && (
            <p className="text-xs text-muted-foreground mt-1 leading-tight">{description}</p>
          )}
        </div>

        {/* Optional Progress Bar */}
        {progress !== undefined && (
          <div className="mt-3 sm:mt-4">
            <Progress value={progress} className="h-2" />
            <p className="text-xs text-muted-foreground mt-1">{progress}% utilized</p>
          </div>
        )}
      </CardContent>
    </Card>
  );
};
