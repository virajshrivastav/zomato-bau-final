import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/lib/supabase";

/**
 * Calculate active drives count for a KAM
 * Uses the get_kam_active_drives PostgreSQL function
 *
 * @param kamEmail - The KAM's email address
 * @returns Query result with active drives count
 */
export function useActiveDrives(kamEmail: string) {
  return useQuery({
    queryKey: ["active_drives", kamEmail],
    queryFn: async () => {
      const { data, error } = await supabase.rpc("get_kam_active_drives", {
        p_kam_email: kamEmail,
      });

      if (error) {
        console.error("Error fetching active drives:", error);
        throw error;
      }

      return data as number;
    },
    enabled: !!kamEmail,
    staleTime: 1000 * 60 * 5, // 5 minutes
  });
}

/**
 * Get detailed breakdown of which drives are active for a KAM
 *
 * @param kamEmail - The KAM's email address
 * @returns Query result with drive participation details
 */
export function useActiveDrivesBreakdown(kamEmail: string) {
  return useQuery({
    queryKey: ["active_drives_breakdown", kamEmail],
    queryFn: async () => {
      // Check NCN participation
      const { data: ncnData } = await supabase
        .from("drive_sheets_data")
        .select("res_id")
        .eq("am_email", kamEmail)
        .not("ncn_p1", "is", null)
        .limit(1);

      // Check N2R participation
      const { data: n2rData } = await supabase
        .from("drive_sheets_data")
        .select("res_id")
        .eq("am_email", kamEmail)
        .not("n2r_la_current_code", "is", null)
        .limit(1);

      // Check Items participation
      const { data: itemsData } = await supabase
        .from("drive_sheets_data")
        .select("res_id")
        .eq("am_email", kamEmail)
        .not("items_priority", "is", null)
        .limit(1);

      return {
        ncn: ncnData && ncnData.length > 0,
        n2r: n2rData && n2rData.length > 0,
        items: itemsData && itemsData.length > 0,
        total: [
          ncnData && ncnData.length > 0,
          n2rData && n2rData.length > 0,
          itemsData && itemsData.length > 0,
        ].filter(Boolean).length,
      };
    },
    enabled: !!kamEmail,
    staleTime: 1000 * 60 * 5, // 5 minutes
  });
}
