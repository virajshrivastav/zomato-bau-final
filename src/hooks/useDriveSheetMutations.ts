import { useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/lib/supabase";
import { useAuth } from "@/contexts/AuthContext";
import { NCNSelectedCodes, ItemAdded } from "./useDriveSheets";

// ============================================================================
// Google Sheets Sync Helper
// ============================================================================

/**
 * Sync restaurant data to Google Sheets via Vercel API
 * Non-blocking: failures are logged but don't affect user experience
 */
async function syncToGoogleSheets(resId: string, drive: "ncn" | "n2r" | "items") {
  try {
    console.log(`[Sheets Sync] Starting sync for ${resId} (${drive})...`);

    const response = await fetch("/api/sync-sheets", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ resId, drive }),
    });

    console.log(`[Sheets Sync] Response status: ${response.status} ${response.statusText}`);

    if (!response.ok) {
      const error = await response
        .json()
        .catch(() => ({ message: "Failed to parse error response" }));
      console.error(`[Sheets Sync] ❌ Failed for ${resId} (${drive}):`, {
        status: response.status,
        statusText: response.statusText,
        error,
      });
    } else {
      const result = await response.json();
      console.log(`[Sheets Sync] ✅ Success for ${resId} (${drive}):`, result);
    }
  } catch (error) {
    // Non-blocking: log error but don't throw
    console.error(`[Sheets Sync] ❌ Network/Exception error for ${resId} (${drive}):`, {
      message: error instanceof Error ? error.message : String(error),
      error,
    });
  }
}

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

      // Sync to Google Sheets (non-blocking)
      syncToGoogleSheets(variables.resId, "ncn");
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

      // Sync to Google Sheets (non-blocking)
      syncToGoogleSheets(variables.resId, "ncn");
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

      // Sync to Google Sheets (non-blocking)
      syncToGoogleSheets(variables.resId, "ncn");
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

      // Sync to Google Sheets (non-blocking)
      syncToGoogleSheets(variables.resId, "n2r");
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

      // Sync to Google Sheets (non-blocking)
      syncToGoogleSheets(variables.resId, "n2r");
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

      // Sync to Google Sheets (non-blocking)
      syncToGoogleSheets(variables.resId, "items");
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

      // Sync to Google Sheets (non-blocking)
      syncToGoogleSheets(variables.resId, "items");
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

      // Sync to Google Sheets (non-blocking)
      syncToGoogleSheets(variables.resId, "items");
    },
  });
}
