// src/lib/cart.ts


import { supabase } from "./supabase";
import type { CartItem } from "./types";

// ── Get all cart items for a user (with product details joined) 
export async function getCartItems(userId: string): Promise<CartItem[]> {

  const { data, error } = await supabase
    .from("cart_items")
    .select(`
      *,
      product:products (*)
    `)
    .eq("user_id", userId)
    .order("added_at", { ascending: false });

  if (error) {
    console.error("getCartItems error:", error.message);
    return [];
  }
  return data as CartItem[];
}

// ── Add a product to cart (or increase quantity if it exists) ─
export async function addToCart(
  userId: string,
  productId: string,
  quantity: number = 1,
  color?: string,
  size?: string
): Promise<{ success: boolean; error?: string }> {
  // Check if this product (with same color+size) already in cart
  const { data: existing } = await supabase
    .from("cart_items")
    .select("id, quantity")
    .eq("user_id", userId)
    .eq("product_id", productId)
    .eq("color", color ?? "")
    .eq("size", size ?? "")
    .maybeSingle();

  if (existing) {
    const { error } = await supabase
      .from("cart_items")
      .update({ quantity: existing.quantity + quantity })
      .eq("id", existing.id);

    if (error) return { success: false, error: error.message };
    return { success: true };
  }

  // Not in cart yet → insert new row
  const { error } = await supabase
    .from("cart_items")
    .insert({ user_id: userId, product_id: productId, quantity, color, size });

  if (error) return { success: false, error: error.message };
  return { success: true };
}

// ── Update quantity of a specific cart item ────────────────────
export async function updateCartQuantity(
  cartItemId: string,
  quantity: number
): Promise<{ success: boolean; error?: string }> {
  if (quantity <= 0) return removeFromCart(cartItemId);

  const { error } = await supabase
    .from("cart_items")
    .update({ quantity })
    .eq("id", cartItemId);

  if (error) return { success: false, error: error.message };
  return { success: true };
}

// ── Remove a single item from cart ────────────────────────────
export async function removeFromCart(
  cartItemId: string
): Promise<{ success: boolean; error?: string }> {
  const { error } = await supabase
    .from("cart_items")
    .delete()
    .eq("id", cartItemId);

  if (error) return { success: false, error: error.message };
  return { success: true };
}

// ── Clear all cart items for a user (after checkout) ──────────
export async function clearCart(
  userId: string
): Promise<{ success: boolean; error?: string }> {
  const { error } = await supabase
    .from("cart_items")
    .delete()
    .eq("user_id", userId);

  if (error) return { success: false, error: error.message };
  return { success: true };
}

// ── Count total items in cart (for the cart badge on navbar) ──
export async function getCartCount(userId: string): Promise<number> {
  const { data, error } = await supabase
    .from("cart_items")
    .select("quantity")
    .eq("user_id", userId);

  if (error || !data) return 0;
  return data.reduce((sum, item) => sum + item.quantity, 0);
}
