import type { SupabaseClient } from "@supabase/supabase-js";
import type { Database, Tables, TablesInsert, TablesUpdate } from "#src/types/supabase.ts";
import { LevelData } from "#src/classes/level.ts";
import { UserData } from "#src/classes/user.ts";

export class RecordData {
    private db: SupabaseClient<Database>;

    data: Tables<"records_view">;
    user: UserData | null = null;
    level: LevelData | null = null;

    constructor(
        db: SupabaseClient<Database>,
        data: Tables<"records_view">,
        user: Tables<"users"> | null = null,
        level: Tables<"levels"> | null = null,
    ) {
        this.db = db;
        this.data = data;
        this.user = user === null ? null : new UserData(db, user);
        this.level = level === null ? null : new LevelData(db, level);
    }
}

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
