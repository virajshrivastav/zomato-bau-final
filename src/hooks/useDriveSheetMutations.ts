import { useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/lib/supabase";
import { useAuth } from "@/contexts/AuthContext";
import { NCNSelectedCodes, ItemAdded } from "./useDriveSheets";

// ============================================================================
// NCN Drive Mutations
// ============================================================================

/**
 * Update NCN approached status
 */
export function useUpdateNCNApproached() {
  const queryClient = useQueryClient();
  const { user } = useAuth();

  return useMutation({
    mutationFn: async ({ resId, approached }: { resId: string; approached: "yes" | "no" }) => {
      const { data, error } = await supabase
        .from("drive_sheets_data")
        .update({
          ncn_approached_by_kam: approached,
          last_updated_by: user?.email || null,
          last_updated_at: new Date().toISOString(),
        })
        .eq("res_id", resId)
        .select();

      if (error) throw error;
      return data;
    },
    onSuccess: (_, variables) => {
      // Invalidate queries to refetch updated data
      queryClient.invalidateQueries({ queryKey: ["drive_sheet", variables.resId] });
      queryClient.invalidateQueries({ queryKey: ["drive_sheets"] });
    },
  });
}

/**
 * Update NCN converted status
 */
export function useUpdateNCNConverted() {
  const queryClient = useQueryClient();
  const { user } = useAuth();

  return useMutation({
    mutationFn: async ({
      resId,
      converted,
    }: {
      resId: string;
      converted: "yes" | "wip" | "no";
    }) => {
      const { data, error } = await supabase
        .from("drive_sheets_data")
        .update({
          ncn_converted_by_kam: converted,
          last_updated_by: user?.email || null,
          last_updated_at: new Date().toISOString(),
        })
        .eq("res_id", resId)
        .select();

      if (error) throw error;
      return data;
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ["drive_sheet", variables.resId] });
      queryClient.invalidateQueries({ queryKey: ["drive_sheets"] });
    },
  });
}

/**
 * Update NCN selected codes
 */
export function useUpdateNCNSelectedCodes() {
  const queryClient = useQueryClient();
  const { user } = useAuth();

  return useMutation({
    mutationFn: async ({
      resId,
      selectedCodes,
    }: {
      resId: string;
      selectedCodes: NCNSelectedCodes;
    }) => {
      const { data, error } = await supabase
        .from("drive_sheets_data")
        .update({
          ncn_selected_codes: selectedCodes,
          last_updated_by: user?.email || null,
          last_updated_at: new Date().toISOString(),
        })
        .eq("res_id", resId)
        .select();

      if (error) throw error;
      return data;
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ["drive_sheet", variables.resId] });
      queryClient.invalidateQueries({ queryKey: ["drive_sheets"] });
    },
  });
}

// ============================================================================
// N2R Drive Mutations
// ============================================================================

/**
 * Update N2R approached status
 */
export function useUpdateN2RApproached() {
  const queryClient = useQueryClient();
  const { user } = useAuth();

  return useMutation({
    mutationFn: async ({ resId, approached }: { resId: string; approached: "yes" | "no" }) => {
      const { data, error } = await supabase
        .from("drive_sheets_data")
        .update({
          n2r_approached_by_kam: approached,
          last_updated_by: user?.email || null,
          last_updated_at: new Date().toISOString(),
        })
        .eq("res_id", resId)
        .select();

      if (error) throw error;
      return data;
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ["drive_sheet", variables.resId] });
      queryClient.invalidateQueries({ queryKey: ["drive_sheets"] });
    },
  });
}

/**
 * Update N2R converted status
 */
export function useUpdateN2RConverted() {
  const queryClient = useQueryClient();
  const { user } = useAuth();

  return useMutation({
    mutationFn: async ({
      resId,
      converted,
    }: {
      resId: string;
      converted: "yes" | "wip" | "no";
    }) => {
      const { data, error } = await supabase
        .from("drive_sheets_data")
        .update({
          n2r_converted_by_kam: converted,
          last_updated_by: user?.email || null,
          last_updated_at: new Date().toISOString(),
        })
        .eq("res_id", resId)
        .select();

      if (error) throw error;
      return data;
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ["drive_sheet", variables.resId] });
      queryClient.invalidateQueries({ queryKey: ["drive_sheets"] });
    },
  });
}

// ============================================================================
// Items Drive Mutations
// ============================================================================

/**
 * Update Items approached status
 */
export function useUpdateItemsApproached() {
  const queryClient = useQueryClient();
  const { user } = useAuth();

  return useMutation({
    mutationFn: async ({ resId, approached }: { resId: string; approached: "yes" | "no" }) => {
      const { data, error } = await supabase
        .from("drive_sheets_data")
        .update({
          items_approached_by_kam: approached,
          last_updated_by: user?.email || null,
          last_updated_at: new Date().toISOString(),
        })
        .eq("res_id", resId)
        .select();

      if (error) throw error;
      return data;
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ["drive_sheet", variables.resId] });
      queryClient.invalidateQueries({ queryKey: ["drive_sheets"] });
    },
  });
}

/**
 * Update Items converted status
 */
export function useUpdateItemsConverted() {
  const queryClient = useQueryClient();
  const { user } = useAuth();

  return useMutation({
    mutationFn: async ({
      resId,
      converted,
    }: {
      resId: string;
      converted: "yes" | "wip" | "no";
    }) => {
      const { data, error } = await supabase
        .from("drive_sheets_data")
        .update({
          items_converted_by_kam: converted,
          last_updated_by: user?.email || null,
          last_updated_at: new Date().toISOString(),
        })
        .eq("res_id", resId)
        .select();

      if (error) throw error;
      return data;
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ["drive_sheet", variables.resId] });
      queryClient.invalidateQueries({ queryKey: ["drive_sheets"] });
    },
  });
}

/**
 * Update Items added
 */
export function useUpdateItemsAdded() {
  const queryClient = useQueryClient();
  const { user } = useAuth();

  return useMutation({
    mutationFn: async ({ resId, items }: { resId: string; items: ItemAdded[] }) => {
      const { data, error } = await supabase
        .from("drive_sheets_data")
        .update({
          items_added: items,
          last_updated_by: user?.email || null,
          last_updated_at: new Date().toISOString(),
        })
        .eq("res_id", resId)
        .select();

      if (error) throw error;
      return data;
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ["drive_sheet", variables.resId] });
      queryClient.invalidateQueries({ queryKey: ["drive_sheets"] });
    },
  });
}
