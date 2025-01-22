import type { SupabaseClient } from "@supabase/supabase-js";
import type { Database } from "#types/supabase.ts";

type TLevel = Database["public"]["Tables"]["levels"];

export class Level {
    private db: SupabaseClient<Database>;
    private APIUrl: string;

    async get(id: number) {
        const { data, error } = await this.db
            .from("levels")
            .select("*, level_rating(*)")
            .eq("id", id)
            .single();

        if (error) {
            throw error;
        }

        return data;
    }

    constructor(_db: SupabaseClient<Database>, _APIUrl: string) {
        this.db = _db;
        this.APIUrl = _APIUrl;
    }
}
