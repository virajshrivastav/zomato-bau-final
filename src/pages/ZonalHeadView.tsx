import ZonalHeader from "@/components/ZonalHeader";
import KPICard from "@/components/KPICard";
import KAMPerformanceTable from "@/components/KAMPerformanceTable";
import { Users, TrendingUp, Target, Activity } from "lucide-react";
import { useZonalStats } from "@/hooks/useZonalStats";

/**
 * Zonal Head View Page
 *
 * Displays aggregated KAM performance metrics and rankings
 * Uses real data from drive_sheets_data table
 */

const ZonalHeadView = () => {
  const { data: zonalStats, isLoading } = useZonalStats();

  // Calculate KPI metrics from real data
  const totalKAMs = zonalStats?.length || 0;
  const totalActiveDrives = zonalStats?.reduce((sum, kam) => sum + kam.active_drives, 0) || 0;
  const totalRestaurants = zonalStats?.reduce((sum, kam) => sum + kam.total_restaurants, 0) || 0;

  return (
    <div className="min-h-screen bg-background">
      <ZonalHeader />

      <main className="max-w-7xl mx-auto p-4 md:p-8 space-y-8 animate-fade-in">
        <div>
          <h2 className="text-2xl md:text-3xl font-bold text-foreground mb-2">
            Performance Dashboard
          </h2>
          <p className="text-muted-foreground">
            Track and analyze Key Account Manager performance across the region
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
          <KPICard
            title="Total KAMs"
            value={isLoading ? "..." : totalKAMs.toString()}
            icon={Users}
            description="Active account managers"
          />
          <KPICard
            title="Total Restaurants"
            value={isLoading ? "..." : totalRestaurants.toLocaleString()}
            icon={Target}
            description="Across all KAMs"
          />
          <KPICard
            title="Active Drives"
            value={isLoading ? "..." : totalActiveDrives.toLocaleString()}
            icon={Activity}
            description="Restaurants in drives"
          />
          <KPICard
            title="Coverage Rate"
            value={
              isLoading
                ? "..."
                : totalRestaurants > 0
                  ? `${((totalActiveDrives / totalRestaurants) * 100).toFixed(1)}%`
                  : "0%"
            }
            icon={TrendingUp}
            description="Drive participation"
          />
        </div>

        <div>
          <h3 className="text-xl font-semibold text-foreground mb-4">KAM Performance Rankings</h3>
          <KAMPerformanceTable />
        </div>
      </main>
    </div>
  );
};

export default ZonalHeadView;
