// src/lib/supabase.ts
// Initializes the Supabase client using environment variables from .env.local
// Think of this like a "database connection string" in C# or Python —
// we set it up once here and import it anywhere we need Supabase.

import { createBrowserClient } from "@supabase/ssr";

export function createClient() {
  return createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  );
}
