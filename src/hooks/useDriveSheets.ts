import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/lib/supabase";

export interface DriveSheetData {
  // Basic Info
  res_id: string;
  res_name: string;
  am_name: string;
  am_email: string;
  tl_email: string | null;
  cuisine: string | null;
  locality: string | null;
  city_name: string | null;
  city_cluster: string | null;
  account_type: string | null;
  sept_ov: string | null;
  
  // NCN Data
  ncn_p1: string | null;
  ncn_p2: string | null;
  ncn_p3: string | null;
  ncn_p4: string | null;
  ncn_p5: string | null;
  ncn_p6: string | null;
  ncn_la: string | null;
  ncn_mm: string | null;
  ncn_um: string | null;
  ncn_la_base_code_suggested: string | null;
  ncn_la_step1: string | null;
  ncn_la_step2: string | null;
  ncn_la_step3: string | null;
  ncn_mm_base_code_suggested: string | null;
  ncn_mm_step1: string | null;
  ncn_mm_step2: string | null;
  ncn_mm_step3: string | null;
  ncn_um_base_code_suggested: string | null;
  ncn_um_step1: string | null;
  ncn_um_step2: string | null;
  ncn_um_step3: string | null;
  ncn_approached: string | null;
  ncn_converted_stepper: string | null;
  ncn_locality_x_cuisine: string | null;
  
  // N2R Data
  n2r_la_ov: string | null;
  n2r_mm_ov: string | null;
  n2r_um_ov: string | null;
  n2r_la_current_code: string | null;
  n2r_la_current_aov: string | null;
  n2r_la_suggested_construct: string | null;
  n2r_la_suggested_mov: string | null;
  n2r_mm_current_code: string | null;
  n2r_mm_current_aov: string | null;
  n2r_mm_suggested_construct: string | null;
  n2r_mm_suggested_mov: string | null;
  n2r_um_current_code: string | null;
  n2r_um_current_aov: string | null;
  n2r_um_suggested_construct: string | null;
  n2r_um_suggested_mov: string | null;
  n2r_la_min_coupons: string | null;
  n2r_mm_min_coupons: string | null;
  n2r_um_min_coupons: string | null;
  n2r_approached: string | null;
  
  // Items Data
  items_priority: string | null;
  items_pos_flag: string | null;
  items_pg_7_10_contribution: string | null;
  items_dish_tag_1: string | null;
  items_dish_tag_2: string | null;
  items_dish_tag_3: string | null;
  items_dish_tag_4: string | null;
  items_dish_tag_5: string | null;
  items_dish_tag_6: string | null;
  items_dish_tag_7: string | null;
  items_approached: string | null;
  items_converted: string | null;
  items_locality_x_cuisine: string | null;
  
  created_at?: string;
  updated_at?: string;
}

/**
 * Fetch all restaurants from drive_sheets_data for the logged-in KAM
 * RLS policies automatically filter by am_email
 */
export function useDriveSheets() {
  return useQuery({
    queryKey: ["drive_sheets"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("drive_sheets_data")
        .select("*")
        .order("res_name", { ascending: true });

      if (error) throw error;
      return data as DriveSheetData[];
    },
  });
}

/**
 * Fetch a single restaurant from drive_sheets_data by ID
 */
export function useDriveSheet(resId: string) {
  return useQuery({
    queryKey: ["drive_sheet", resId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("drive_sheets_data")
        .select("*")
        .eq("res_id", resId)
        .single();

      if (error) throw error;
      return data as DriveSheetData;
    },
    enabled: !!resId,
  });
}

