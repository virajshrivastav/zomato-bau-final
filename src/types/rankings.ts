/**
 * KAM Rankings and Performance Tracking Types
 * ============================================
 * Types for KAM performance metrics, rankings, and rank movements
 */

/**
 * Individual drive ranking data
 */
export interface DriveRanking {
  rank: number | null;
  metric_value: string | null;
  rank_change: number; // Positive = improved (moved up), Negative = declined (moved down)
}

/**
 * Complete KAM performance summary with all drives
 */
export interface KAMPerformanceSummary {
  kam_email: string;

  // NCN Drive
  ncn_rank: number | null;
  ncn_metric: string | null;
  ncn_rank_change: number;

  // N2R Drive
  n2r_rank: number | null;
  n2r_metric: string | null;
  n2r_rank_change: number;

  // Items Drive
  items_rank: number | null;
  items_metric: string | null;
  items_rank_change: number;

  // Active Drives
  active_drives: number;
  active_drives_change: number;
}

/**
 * Historical rank record
 */
export interface KAMRankHistory {
  id: number;
  kam_email: string;
  date: string;
  ncn_rank: number | null;
  n2r_rank: number | null;
  items_rank: number | null;
  ncn_metric_value: string | null;
  n2r_metric_value: string | null;
  items_metric_value: string | null;
  active_drives_count: number;
  created_at: string;
}

/**
 * NCN Ranking view data
 */
export interface NCNRanking {
  kam_email: string;
  metric_value: string;
  rank: number;
}

/**
 * N2R Ranking view data
 */
export interface N2RRanking {
  kam_email: string;
  avg_conversion: number;
  metric_value: string;
  rank: number;
}

/**
 * Items Ranking view data
 */
export interface ItemsRanking {
  kam_email: string;
  metric_value: string;
  rank: number;
}

/**
 * Performance metric card data for UI
 */
export interface PerformanceMetricCard {
  title: string;
  rank: number | null;
  metric: string | null;
  rankChange: number;
  description: string;
  isActive: boolean; // Whether KAM participates in this drive
}
