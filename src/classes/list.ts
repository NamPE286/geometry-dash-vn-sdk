import type { SupabaseClient } from "@supabase/supabase-js";
import type { Database } from "#src/types/supabase.ts";
import { LevelData } from "#src/classes/level.ts";

export class List {
    private db: SupabaseClient<Database>;
    private APIUrl: string;

    async getLevels(
        list: string,
        {
            range = { start: 0, end: 50 },
            userID = "00000000-0000-0000-0000-000000000000",
        }: {
            range?: { start: number; end: number };
            userID?: string;
        },
    ): Promise<LevelData[]> {
        const { data, error } = await this.db
            .from("level_rating")
            .select("*, levels(*, level_rating(*), records_view(*))")
            .eq("list", list)
            .eq("levels.records_view.list", list)
            .eq("levels.records_view.user_id", userID)
            .order("rating", { ascending: false })
            .range(range.start, range.end);

        if (error) {
            throw error;
        }

        const res: LevelData[] = [];

        for (const i of data) {
            const { level_rating, records_view, ...level } = i.levels;
            res.push(new LevelData(this.db, level, level_rating, records_view));
        }

        return res;
    }

    constructor(_db: SupabaseClient<Database>, _APIUrl: string) {
        this.db = _db;
        this.APIUrl = _APIUrl;
    }
}
