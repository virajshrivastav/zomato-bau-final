import { MetricCard } from "@/components/temp/ui/MetricCard";
import { RestaurantMetrics } from "@/types/restaurantTemp";
import { Grid3x3, TrendingUp, IndianRupee, Smartphone, Percent } from "lucide-react";

interface MetricsRowProps {
  metrics: RestaurantMetrics;
}

export const MetricsRow = ({ metrics }: MetricsRowProps) => {
  // Format ADS BR for display
  const formattedAdsBR = metrics.adsBRCM
    ? `₹${parseFloat(metrics.adsBRCM).toLocaleString("en-IN")}`
    : "N/A";

  // Format Commission for display
  const formattedCommission = metrics.commission ? `${metrics.commission}%` : "N/A";

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
      <MetricCard
        title="Active Drives"
        value={metrics.activeDrives}
        icon={Grid3x3}
        variant="primary"
      />
      <MetricCard
        title="ZVD PO"
        value={metrics.zvdPo}
        icon={TrendingUp}
        variant="success"
        description="Zomato Vouchered Discount Per Order"
      />
      <MetricCard
        title="Commission"
        value={formattedCommission}
        icon={Percent}
        variant="warning"
        description={metrics.lastChangeDate || "Last Change Date: N/A"}
      />
      <MetricCard
        title="ADS BR (CM)"
        value={formattedAdsBR}
        icon={IndianRupee}
        variant="success"
        description="Booked Revenue Current Month"
      />
      <MetricCard
        title="TOING Flag"
        value={metrics.toingFlag}
        icon={Smartphone}
        variant={metrics.toingFlag === "Live" ? "success" : "default"}
      />
    </div>
  );
};
