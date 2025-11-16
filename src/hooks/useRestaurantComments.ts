import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/lib/supabase";
import { useAuth } from "@/contexts/AuthContext";

export interface RestaurantComment {
  id: string;
  res_id: string;
  author_email: string;
  author_name: string | null;
  comment_text: string;
  created_at: string;
  updated_at: string;
}

interface AddCommentParams {
  res_id: string;
  comment_text: string;
}

interface UpdateCommentParams {
  id: string;
  comment_text: string;
}

/**
 * Sync comments to Google Sheets via Vercel API
 * Non-blocking: failures are logged but don't affect user experience
 */
async function syncCommentsToGoogleSheets(resId: string) {
  try {
    const response = await fetch("/api/sync-sheets", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ resId, drive: "comments" }),
    });

    if (!response.ok) {
      const error = await response.json();
      console.error(`[Sheets Sync] Failed for ${resId} (comments):`, error);
    } else {
      const result = await response.json();
      console.log(`[Sheets Sync] Success for ${resId} (comments):`, result);
    }
  } catch (error) {
    // Non-blocking: log error but don't throw
    console.error(`[Sheets Sync] Error for ${resId} (comments):`, error);
  }
}

/**
 * Hook to fetch comments for a specific restaurant
 */
export function useRestaurantComments(resId: string) {
  return useQuery({
    queryKey: ["restaurant-comments", resId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("restaurant_comments")
        .select("*")
        .eq("res_id", resId)
        .order("created_at", { ascending: false });

      if (error) {
        console.error("Error fetching comments:", error);
        throw error;
      }

      return data as RestaurantComment[];
    },
    enabled: !!resId,
  });
}

/**
 * Hook to add a new comment
 */
export function useAddComment() {
  const queryClient = useQueryClient();
  const { user } = useAuth();

  return useMutation({
    mutationFn: async ({ res_id, comment_text }: AddCommentParams) => {
      if (!user?.email) {
        throw new Error("User must be authenticated to add comments");
      }

      const { data, error } = await supabase
        .from("restaurant_comments")
        .insert({
          res_id,
          author_email: user.email,
          author_name: user.user_metadata?.name || user.email,
          comment_text,
        })
        .select()
        .single();

      if (error) {
        console.error("Error adding comment:", error);
        throw error;
      }

      return data as RestaurantComment;
    },
    onSuccess: (data) => {
      // Invalidate and refetch comments for this restaurant
      queryClient.invalidateQueries({
        queryKey: ["restaurant-comments", data.res_id],
      });

      // Sync to Google Sheets (non-blocking)
      syncCommentsToGoogleSheets(data.res_id);
    },
  });
}

/**
 * Hook to update an existing comment
 */
export function useUpdateComment() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ id, comment_text }: UpdateCommentParams) => {
      const { data, error } = await supabase
        .from("restaurant_comments")
        .update({ comment_text })
        .eq("id", id)
        .select()
        .single();

      if (error) {
        console.error("Error updating comment:", error);
        throw error;
      }

      return data as RestaurantComment;
    },
    onSuccess: (data) => {
      // Invalidate and refetch comments for this restaurant
      queryClient.invalidateQueries({
        queryKey: ["restaurant-comments", data.res_id],
      });

      // Sync to Google Sheets (non-blocking)
      syncCommentsToGoogleSheets(data.res_id);
    },
  });
}

/**
 * Hook to delete a comment
 */
export function useDeleteComment() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ id, res_id }: { id: string; res_id: string }) => {
      const { error } = await supabase.from("restaurant_comments").delete().eq("id", id);

      if (error) {
        console.error("Error deleting comment:", error);
        throw error;
      }

      return { id, res_id };
    },
    onSuccess: (data) => {
      // Invalidate all comment queries
      queryClient.invalidateQueries({
        queryKey: ["restaurant-comments"],
      });

      // Sync to Google Sheets (non-blocking)
      syncCommentsToGoogleSheets(data.res_id);
    },
  });
}
