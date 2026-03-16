// src/lib/auth.ts

import { supabase } from "./supabase";
import bcrypt from "bcryptjs";
import type { CrishetteUser } from "./types";

const SESSION_KEY = "crishette_user";

// ── Session Helpers ───────────────────────────────────────────

export function getSession(): CrishetteUser | null {
  if (typeof window === "undefined") return null;
  try {
    const raw = localStorage.getItem(SESSION_KEY);
    return raw ? (JSON.parse(raw) as CrishetteUser) : null;
  } catch {
    return null;
  }
}

export function setSession(user: CrishetteUser): void {
  localStorage.setItem(SESSION_KEY, JSON.stringify(user));
}

export function clearSession(): void {
  localStorage.removeItem(SESSION_KEY);
}

export function isLoggedIn(): boolean {
  return getSession() !== null;
}

export function isAdmin(): boolean {
  return getSession()?.role === "admin";
}

// ── Register ──────────────────────────────────────────────────

export async function register(
  username: string,
  email: string,
  password: string
): Promise<{ success: boolean; user?: CrishetteUser; error?: string }> {
  // Check email uniqueness
  const { data: byEmail } = await supabase
    .from("users")
    .select("id")
    .eq("email", email)
    .maybeSingle();
  if (byEmail) return { success: false, error: "Email is already registered." };

  // Check username uniqueness
  const { data: byUsername } = await supabase
    .from("users")
    .select("id")
    .eq("username", username)
    .maybeSingle();
  if (byUsername) return { success: false, error: "Username is already taken." };

  // Hash password before saving — NEVER store plain text
  const hashedPassword = await bcrypt.hash(password, 10);

  const { data, error } = await supabase
    .from("users")
    .insert({ username, email, password: hashedPassword, role: "user" })
    .select("id, username, email, role, phone, gender, avatar_url, address, created_at")
    .single();

  if (error || !data) return { success: false, error: "Registration failed. Please try again." };

  const user = data as CrishetteUser;
  setSession(user);
  return { success: true, user };
}

// ── Login ─────────────────────────────────────────────────────

export async function login(
  email: string,
  password: string
): Promise<{ success: boolean; user?: CrishetteUser; error?: string }> {
  const { data, error } = await supabase
    .from("users")
    .select("id, username, email, password, role, phone, gender, avatar_url, address, created_at")
    .eq("email", email)
    .maybeSingle();

  if (error || !data) return { success: false, error: "No account found with this email." };

  const match = await bcrypt.compare(password, data.password);
  if (!match) return { success: false, error: "Incorrect password." };

  const user: CrishetteUser = {
    id: data.id,
    username: data.username,
    email: data.email,
    role: data.role,
    phone: data.phone,
    gender: data.gender,
    avatar_url: data.avatar_url,
    address: data.address,
    created_at: data.created_at,
  };

  setSession(user);
  return { success: true, user };
}

// ── Logout ────────────────────────────────────────────────────

export function logout(): void {
  clearSession();
}

// ── Update Profile ────────────────────────────────────────────

export async function updateProfile(
  userId: string,
  updates: Partial<Pick<CrishetteUser, "username" | "phone" | "gender" | "avatar_url" | "address">>
): Promise<{ success: boolean; user?: CrishetteUser; error?: string }> {
  const { data, error } = await supabase
    .from("users")
    .update(updates)
    .eq("id", userId)
    .select("id, username, email, role, phone, gender, avatar_url, address, created_at")
    .single();

  if (error || !data) return { success: false, error: "Failed to update profile." };

  const user = data as CrishetteUser;
  setSession(user);
  return { success: true, user };
}
