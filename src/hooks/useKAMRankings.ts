import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/lib/supabase";
import type { KAMPerformanceSummary, NCNRanking, N2RRanking, ItemsRanking } from "@/types/rankings";

/**
 * Fetch complete KAM performance summary including ranks and movements
 * Uses the get_kam_performance_summary PostgreSQL function
 *
 * @param kamEmail - The KAM's email address
 * @returns Query result with complete performance data
 */
export function useKAMPerformanceSummary(kamEmail: string) {
  return useQuery({
    queryKey: ["kam_performance_summary", kamEmail],
    queryFn: async () => {
      const { data, error } = await supabase.rpc("get_kam_performance_summary", {
        p_kam_email: kamEmail,
      });

      if (error) {
        console.error("Error fetching KAM performance summary:", error);
        throw error;
      }

      // The function returns an array with one row
      if (!data || data.length === 0) {
        return null;
      }

      return data[0] as KAMPerformanceSummary;
    },
    enabled: !!kamEmail,
    staleTime: 1000 * 60 * 5, // 5 minutes
  });
}

/**
 * Fetch all NCN rankings
 * @returns Query result with all KAM NCN rankings
 */
export function useNCNRankings() {
  return useQuery({
    queryKey: ["ncn_rankings"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("ncn_rankings")
        .select("*")
        .order("rank", { ascending: true });

      if (error) throw error;
      return data as NCNRanking[];
    },
    staleTime: 1000 * 60 * 5, // 5 minutes
  });
}

/**
 * Fetch all N2R rankings
 * @returns Query result with all KAM N2R rankings
 */
export function useN2RRankings() {
  return useQuery({
    queryKey: ["n2r_rankings"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("n2r_rankings")
        .select("*")
        .order("rank", { ascending: true });

      if (error) throw error;
      return data as N2RRanking[];
    },
    staleTime: 1000 * 60 * 5, // 5 minutes
  });
}

/**
 * Fetch all Items rankings
 * @returns Query result with all KAM Items rankings
 */
export function useItemsRankings() {
  return useQuery({
    queryKey: ["items_rankings"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("items_rankings")
        .select("*")
        .order("rank", { ascending: true });

      if (error) throw error;
      return data as ItemsRanking[];
    },
    staleTime: 1000 * 60 * 5, // 5 minutes
  });
}

/**
 * Fetch specific KAM's NCN ranking
 * @param kamEmail - The KAM's email address
 * @returns Query result with KAM's NCN ranking
 */
export function useKAMNCNRank(kamEmail: string) {
  return useQuery({
    queryKey: ["ncn_rank", kamEmail],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("ncn_rankings")
        .select("*")
        .eq("kam_email", kamEmail)
        .single();

      if (error) {
        // Return null if KAM not in NCN drive
        if (error.code === "PGRST116") return null;
        throw error;
      }

      return data as NCNRanking;
    },
    enabled: !!kamEmail,
    staleTime: 1000 * 60 * 5, // 5 minutes
  });
}

/**
 * Fetch specific KAM's N2R ranking
 * @param kamEmail - The KAM's email address
 * @returns Query result with KAM's N2R ranking
 */
export function useKAMN2RRank(kamEmail: string) {
  return useQuery({
    queryKey: ["n2r_rank", kamEmail],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("n2r_rankings")
        .select("*")
        .eq("kam_email", kamEmail)
        .single();

      if (error) {
        // Return null if KAM not in N2R drive
        if (error.code === "PGRST116") return null;
        throw error;
      }

      return data as N2RRanking;
    },
    enabled: !!kamEmail,
    staleTime: 1000 * 60 * 5, // 5 minutes
  });
}

/**
 * Fetch specific KAM's Items ranking
 * @param kamEmail - The KAM's email address
 * @returns Query result with KAM's Items ranking
 */
export function useKAMItemsRank(kamEmail: string) {
  return useQuery({
    queryKey: ["items_rank", kamEmail],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("items_rankings")
        .select("*")
        .eq("kam_email", kamEmail)
        .single();

      if (error) {
        // Return null if KAM not in Items drive
        if (error.code === "PGRST116") return null;
        throw error;
      }

      return data as ItemsRanking;
    },
    enabled: !!kamEmail,
    staleTime: 1000 * 60 * 5, // 5 minutes
  });
}
