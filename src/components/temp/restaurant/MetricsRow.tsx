import { MetricCard } from "@/components/temp/ui/MetricCard";
import { RestaurantMetrics } from "@/types/restaurantTemp";
import { Grid3x3, TrendingUp, IndianRupee, Smartphone } from "lucide-react";

interface MetricsRowProps {
  metrics: RestaurantMetrics;
}

export const MetricsRow = ({ metrics }: MetricsRowProps) => {
  // Format ADS BR for display
  const formattedAdsBR = metrics.adsBRCM
    ? `₹${parseFloat(metrics.adsBRCM).toLocaleString("en-IN")}`
    : "N/A";

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
        title="ADS Achievement"
        value={metrics.adsAvgAchievement || "N/A"}
        icon={IndianRupee}
        variant="warning"
        description="Average ADS Achievement"
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
