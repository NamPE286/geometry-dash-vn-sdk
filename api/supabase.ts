import { createClient } from "@supabase/supabase-js";
import type { Database } from "#types/supabase.ts";
import "jsr:@std/dotenv/load";

export const supabase = createClient<Database>(Deno.env.get("SUPABASE_API_URL")!, Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!);
