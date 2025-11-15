import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/lib/supabase";
import type { NCNSummary, N2RSummary, ItemsSummary } from "@/types/performanceMetrics";

/**
 * Fetch NCN summary for a specific KAM
 * @param kamEmail - The KAM's email address
 * @returns Query result with NCN summary data or null if not found
 */
export function useNCNSummary(kamEmail: string) {
  return useQuery({
    queryKey: ["ncn_summary", kamEmail],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("ncn_summary")
        .select("*")
        .eq("kam_email", kamEmail)
        .single();

      if (error) {
        // Return null if no data found (KAM not in NCN drive)
        if (error.code === "PGRST116") return null;
        throw error;
      }

      return data as NCNSummary;
    },
    enabled: !!kamEmail,
    staleTime: 1000 * 60 * 5, // 5 minutes
  });
}

/**
 * Fetch N2R summary for a specific KAM
 * @param kamEmail - The KAM's email address
 * @returns Query result with N2R summary data or null if not found
 */
export function useN2RSummary(kamEmail: string) {
  return useQuery({
    queryKey: ["n2r_summary", kamEmail],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("n2r_summary")
        .select("*")
        .eq("kam_email", kamEmail)
        .single();

      if (error) {
        // Return null if no data found (KAM not in N2R drive)
        if (error.code === "PGRST116") return null;
        throw error;
      }

      return data as N2RSummary;
    },
    enabled: !!kamEmail,
    staleTime: 1000 * 60 * 5, // 5 minutes
  });
}

/**
 * Fetch Items summary for a specific KAM
 * @param kamEmail - The KAM's email address
 * @returns Query result with Items summary data or null if not found
 */
export function useItemsSummary(kamEmail: string) {
  return useQuery({
    queryKey: ["items_summary", kamEmail],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("items_summary")
        .select("*")
        .eq("kam_email", kamEmail)
        .single();

      if (error) {
        // Return null if no data found (KAM not in Items drive)
        if (error.code === "PGRST116") return null;
        throw error;
      }

      return data as ItemsSummary;
    },
    enabled: !!kamEmail,
    staleTime: 1000 * 60 * 5, // 5 minutes
  });
}

/**
 * Fetch all performance metrics for a KAM (combined)
 * @param kamEmail - The KAM's email address
 * @returns Combined query results for NCN, N2R, and Items drives
 */
export function usePerformanceMetrics(kamEmail: string) {
  const ncn = useNCNSummary(kamEmail);
  const n2r = useN2RSummary(kamEmail);
  const items = useItemsSummary(kamEmail);

  return {
    ncn,
    n2r,
    items,
    isLoading: ncn.isLoading || n2r.isLoading || items.isLoading,
    error: ncn.error || n2r.error || items.error,
  };
}
