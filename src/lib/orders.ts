// src/lib/orders.ts
// ============================================================
// All Supabase queries for orders — placing and viewing them.
// ============================================================

import { supabase } from "./supabase";
import type { Order, CartItem } from "./types";

// ── Place an order from the current cart ──────────────────────
// This is called when the user clicks "Place Order" on checkout.
// It:
//   1. Creates an order row
//   2. Copies cart items into order_items (snapshot)
//   3. (Cart is cleared separately by clearCart())
export async function placeOrder(
  userId: string,
  cartItems: CartItem[],
  shippingCost: number,
  shippingOption: string,
  paymentMethod: string,
  deliveryAddress: string
): Promise<{ success: boolean; orderId?: string; error?: string }> {
  // Calculate merchandise total
  const merchandiseTotal = cartItems.reduce(
    (sum, item) => sum + (item.product?.price ?? 0) * item.quantity,
    0
  );
  const totalPrice = merchandiseTotal + shippingCost;

  // 1. Insert the order
  const { data: order, error: orderError } = await supabase
    .from("orders")
    .insert({
      user_id: userId,
      total_price: totalPrice,
      shipping_cost: shippingCost,
      shipping_option: shippingOption,
      payment_method: paymentMethod,
      delivery_address: deliveryAddress,
      status: "Pending",
    })
    .select("id")
    .single();

  if (orderError || !order) {
    return { success: false, error: orderError?.message ?? "Failed to create order." };
  }

  // 2. Insert order_items (snapshot of products at purchase time)
  const orderItems = cartItems.map((item) => ({
    order_id: order.id,
    product_id: item.product_id,
    product_name: item.product?.name ?? "Unknown Product",
    product_image: item.product?.image,
    quantity: item.quantity,
    price_at_purchase: item.product?.price ?? 0,
    color: item.color,
    size: item.size,
  }));

  const { error: itemsError } = await supabase
    .from("order_items")
    .insert(orderItems);

  if (itemsError) {
    return { success: false, error: itemsError.message };
  }

  return { success: true, orderId: order.id };
}

// ── Get all orders for a user (for "My Purchases") ────────────
export async function getUserOrders(userId: string): Promise<Order[]> {
  const { data, error } = await supabase
    .from("orders")
    .select(`
      *,
      order_items (*)
    `)
    .eq("user_id", userId)
    .order("created_at", { ascending: false });

  if (error) {
    console.error("getUserOrders error:", error.message);
    return [];
  }
  return data as Order[];
}

// ── Get a single order by ID ───────────────────────────────────
export async function getOrderById(orderId: string): Promise<Order | null> {
  const { data, error } = await supabase
    .from("orders")
    .select(`
      *,
      order_items (*)
    `)
    .eq("id", orderId)
    .single();

  if (error) {
    console.error("getOrderById error:", error.message);
    return null;
  }
  return data as Order;
}

// ── ADMIN: Get all orders across all users ────────────────────
export async function adminGetAllOrders(): Promise<Order[]> {
  const { data, error } = await supabase
    .from("orders")
    .select(`
      *,
      order_items (*)
    `)
    .order("created_at", { ascending: false });

  if (error) {
    console.error("adminGetAllOrders error:", error.message);
    return [];
  }
  return data as Order[];
}

// ── ADMIN: Update order status ────────────────────────────────
export async function adminUpdateOrderStatus(
  orderId: string,
  status: Order["status"]
): Promise<{ success: boolean; error?: string }> {
  const { error } = await supabase
    .from("orders")
    .update({ status })
    .eq("id", orderId);

  if (error) return { success: false, error: error.message };
  return { success: true };
}
