// src/lib/types.ts

export type UserRole = "user" | "admin";
export type OrderStatus = "Pending" | "Processing" | "In Transit" | "Completed" | "Cancelled";

export interface CrishetteUser {
    id: string;
    username: string;
    email: string;
    role: UserRole;
    phone?: string;
    gender?: "Male" | "Female" | "Other";
    avatar_url?: string;
    address?: string;
    created_at: string;
}

export interface Product {
    id: string;
    name: string;
    description: string;
    price: number;
    image: string;
    colors: string[];
    sizes: string[];
    stock: number;
    category?: string;     
    is_featured: boolean;
    is_published: boolean;
    created_at: string;
    updated_at: string;
}

// ── Review ────────────────────────────────────────────────────
export interface Review {
    id: string;
    product_id: string;
    user_id: string;
    rating: number;          
    created_at: string;
}

export interface CartItem {
    id: string;
    user_id: string;
    product_id: string;
    quantity: number;
    color?: string;
    size?: string;
    added_at: string;
    product?: Product;
}

export interface Order {
    id: string;
    user_id: string;
    total_price: number;
    shipping_cost: number;
    shipping_option: string;
    payment_method: string;
    delivery_address?: string;
    status: OrderStatus;
    created_at: string;
    order_items?: OrderItem[];
}

export interface OrderItem {
    id: string;
    order_id: string;
    product_id: string;
    product_name: string;
    product_image?: string;
    quantity: number;
    price_at_purchase: number;
    color?: string;
    size?: string;
}

export interface Like {
    id: string;
    user_id: string;
    product_id: string;
    liked_at: string;
    product?: Product;
}