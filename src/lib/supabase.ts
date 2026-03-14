// src/lib/supabase.ts
// ============================================================
// Supabase Client — single shared instance for the whole app
// Think of this like a static DatabaseContext in C# or a
// singleton DbHelper in Java. We create it once and reuse it.
// ============================================================

import { createClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

export const supabase = createClient(supabaseUrl, supabaseAnonKey);
