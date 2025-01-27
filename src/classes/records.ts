import type { SupabaseClient } from "@supabase/supabase-js";
import type { Database, TablesInsert, TablesUpdate } from "#src/types/supabase.ts";

export class Records {
    private db: SupabaseClient<Database>;
    private APIUrl: string;

    async fetch(levelID: number, userID: string) {
        // TODO
    }

    async add(data: TablesInsert<"records">): Promise<void> {
        // TODO
    }

    async update(data: TablesUpdate<"records">): Promise<void> {
        // TODO
    }

    async delete(levelID: number, userID: string): Promise<void> {
        // TODO
    }

    constructor(_db: SupabaseClient<Database>, _APIUrl: string) {
        this.db = _db;
        this.APIUrl = _APIUrl;
    }
}
