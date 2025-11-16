import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/lib/supabase";

export interface KAMStats {
  kam_email: string;
  kam_name: string;
  tl_email: string;
  team: string;
  ads_avg_achievement: string | null;
  active_drives: number;
  total_restaurants: number;
}

/**
 * Fetch aggregated KAM statistics for Zonal Head View
 * Groups by KAM email and calculates active drives count
 */
export function useZonalStats() {
  return useQuery({
    queryKey: ["zonal_stats"],
    queryFn: async () => {
      // Fetch all restaurants with their KAM info and drive data
      const { data, error } = await supabase
        .from("drive_sheets_data")
        .select(
          "am_email, am_name, tl_email, ads_avg_achievement, ncn_priority, n2r_priority, items_priority"
        );

      if (error) throw error;

      // Group by KAM email and aggregate stats
      const kamMap = new Map<string, KAMStats>();

      data.forEach((row) => {
        const email = row.am_email;
        if (!email) return;

        if (!kamMap.has(email)) {
          kamMap.set(email, {
            kam_email: email,
            kam_name: row.am_name || email.split("@")[0],
            tl_email: row.tl_email || "",
            team: "", // Will be derived from tl_email or set separately
            ads_avg_achievement: row.ads_avg_achievement,
            active_drives: 0,
            total_restaurants: 0,
          });
        }

        const kamStats = kamMap.get(email)!;
        kamStats.total_restaurants++;

        // Count active drives (if restaurant has priority set for any drive)
        const hasNCN = row.ncn_priority && row.ncn_priority !== "NULL";
        const hasN2R = row.n2r_priority && row.n2r_priority !== "NULL";
        const hasItems = row.items_priority && row.items_priority !== "NULL";

        if (hasNCN || hasN2R || hasItems) {
          kamStats.active_drives++;
        }
      });

      return Array.from(kamMap.values());
    },
    staleTime: 1000 * 60 * 5, // 5 minutes
  });
}
