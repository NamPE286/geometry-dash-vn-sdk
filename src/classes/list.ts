import type { SupabaseClient } from "@supabase/supabase-js";
import type { Database } from "#src/types/supabase.ts";
import { LevelData } from "#src/classes/level.ts";

export class List {
    private db: SupabaseClient<Database>;
    private APIUrl: string;

    async getLevels(
        list: string,
        { range = { start: 0, end: 50 }, userID = "" },
    ): Promise<LevelData[]> {
        const { data, error } = await this.db
            .from("level_rating")
            .select("*, levels(*, level_rating(*))")
            .eq("list", list)
            .order("rating", { ascending: false })
            .range(range.start, range.end);

        if (error) {
            throw error;
        }

        const res: LevelData[] = [];

        for (const i of data) {
            const { level_rating, ...level } = i.levels;
            res.push(new LevelData(this.db, level, level_rating));
        }

        return res;
    }

    constructor(_db: SupabaseClient<Database>, _APIUrl: string) {
        this.db = _db;
        this.APIUrl = _APIUrl;
    }
}
