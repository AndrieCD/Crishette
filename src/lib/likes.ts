// src/lib/likes.ts
// ============================================================
// All Supabase queries for the "My Likes" feature.
// ============================================================

import { supabase } from "./supabase";
import type { Like } from "./types";

// ── Get all liked products for a user ─────────────────────────
export async function getUserLikes(userId: string): Promise<Like[]> {
  const { data, error } = await supabase
    .from("likes")
    .select(`
      *,
      product:products (*)
    `)
    .eq("user_id", userId)
    .order("liked_at", { ascending: false });

  if (error) {
    console.error("getUserLikes error:", error.message);
    return [];
  }
  return data as Like[];
}

// ── Check if a user has liked a specific product ──────────────
export async function isLiked(userId: string, productId: string): Promise<boolean> {
  const { data } = await supabase
    .from("likes")
    .select("id")
    .eq("user_id", userId)
    .eq("product_id", productId)
    .maybeSingle();

  return !!data;
}

// ── Toggle like (like if not liked, unlike if already liked) ──
export async function toggleLike(
  userId: string,
  productId: string
): Promise<{ success: boolean; liked: boolean; error?: string }> {
  const already = await isLiked(userId, productId);

  if (already) {
    // Unlike
    const { error } = await supabase
      .from("likes")
      .delete()
      .eq("user_id", userId)
      .eq("product_id", productId);

    if (error) return { success: false, liked: true, error: error.message };
    return { success: true, liked: false };
  } else {
    // Like
    const { error } = await supabase
      .from("likes")
      .insert({ user_id: userId, product_id: productId });

    if (error) return { success: false, liked: false, error: error.message };
    return { success: true, liked: true };
  }
}
