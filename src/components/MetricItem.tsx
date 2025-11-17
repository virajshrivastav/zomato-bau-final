import { StatusPill } from "./StatusPill";

interface MetricItemProps {
  label: string;
  value: string | number;
  showPill?: boolean;
  pillType?: "success" | "warning" | "danger" | "neutral";
}

export const MetricItem = ({ label, value, showPill, pillType }: MetricItemProps) => {
  const getStatusType = (val: string | number): "success" | "warning" | "danger" | "neutral" => {
    if (pillType) return pillType;
    const numValue = typeof val === "string" ? parseInt(val) : val;
    if (numValue >= 70) return "success";
    if (numValue >= 40) return "warning";
    return "danger";
  };

  return (
    <div className="flex items-center justify-between py-2 sm:py-3 hover:bg-muted/50 px-2 sm:px-3 rounded-lg transition-all duration-200 hover:scale-[1.02] group gap-2">
      <span className="text-xs sm:text-sm font-semibold text-foreground group-hover:text-primary transition-colors break-words min-w-0">
        {label}
      </span>
      {showPill ? (
        <StatusPill type={getStatusType(value)} className="flex-shrink-0">
          {value}
        </StatusPill>
      ) : (
        <span className="text-xs sm:text-sm font-medium text-muted-foreground flex-shrink-0">
          {value}
        </span>
      )}
    </div>
  );
};
