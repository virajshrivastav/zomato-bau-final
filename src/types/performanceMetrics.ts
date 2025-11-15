/**
 * Performance Metrics Type Definitions
 *
 * These types correspond to the summary tables in Supabase:
 * - ncn_summary
 * - n2r_summary
 * - items_summary
 */

/**
 * NCN Drive Summary Data
 * Source: ncn_summary table
 */
export interface NCNSummary {
  kam_email: string;
  kam_name: string | null;
  tl_email: string | null;
  team: string | null;

  // Stepper/Base Coverage (Columns E-J)
  la_base_coverage: string | null;
  mm_base_coverage: string | null;
  um_base_coverage: string | null;
  la_stepper_coverage: string | null;
  mm_stepper_coverage: string | null;
  um_stepper_coverage: string | null;

  // Delta indicators (Columns K-M)
  delta_la: string | null;
  delta_mm: string | null;
  delta_um: string | null;

  // Other Coverage Metrics
  flash_sale_coverage: string | null; // Column O
  bogo_ov_coverage: string | null; // Column Q
  overall_ov_coverage: string | null; // Column T
  overall_res_coverage: string | null; // Column U

  // BOGO Sub-metrics (Columns V-X)
  bogo_get150: string | null;
  bogo_take150: string | null;
  bogo_binge150: string | null;

  updated_at: string;
}

/**
 * N2R Drive Summary Data
 * Source: n2r_summary table
 */
export interface N2RSummary {
  kam_email: string;
  kam_name: string | null;
  tl_email: string | null;
  team: string | null;

  // OV Conversion Metrics (Columns M, S, Y)
  la_ov_conversion: string | null;
  mm_ov_conversion: string | null;
  um_ov_conversion: string | null;

  updated_at: string;
}

/**
 * Items Drive Summary Data
 * Source: items_summary table
 */
export interface ItemsSummary {
  kam_email: string;
  kam_name: string | null;
  tl_email: string | null;
  team: string | null;

  // OV Coverage weekly data (Columns BZ:CV)
  ov_coverage_baseline: string | null;
  ov_coverage_week_41: string | null;
  ov_coverage_week_42: string | null;
  ov_coverage_week_43: string | null;
  ov_coverage_week_44: string | null;
  ov_coverage_delta: string | null;
  ov_coverage_wow: string | null;

  // Items count weekly data (Columns DV:ER)
  items_count_baseline: string | null;
  items_count_week_41: string | null;
  items_count_week_42: string | null;
  items_count_week_43: string | null;
  items_count_week_44: string | null;
  items_count_delta: string | null;
  items_count_wow: string | null;

  updated_at: string;
}

/**
 * Combined performance metrics
 * Used by usePerformanceMetrics hook
 */
export interface PerformanceMetrics {
  ncn: NCNSummary | null;
  n2r: N2RSummary | null;
  items: ItemsSummary | null;
}
