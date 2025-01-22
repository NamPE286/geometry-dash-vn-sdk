import type { SupabaseClient } from "@supabase/supabase-js";
import type { Database, Tables } from "#types/supabase.ts";

type TLevel = Database["public"]["Tables"]["levels"];
type TLevelData = TLevel["Row"] & { ratings: Tables<"level_rating">[] };

export interface LevelData extends TLevelData {}

export class LevelData {
    getRating(list: string) {
        for (const i of this.ratings) {
            if (i.list === list) {
                return i;
            }
        }

        return null;
    }

    constructor(data: TLevelData) {
        Object.assign(this, data);
    }
}

export class Level {
    private db: SupabaseClient<Database>;
    private APIUrl: string;

    async get(id: number): Promise<LevelData> {
        const { data, error } = await this.db
            .from("levels")
            .select("*, ratings:level_rating(*)")
            .eq("id", id)
            .single();

        if (error) {
            throw error;
        }

        return new LevelData(data);
    }

    constructor(_db: SupabaseClient<Database>, _APIUrl: string) {
        this.db = _db;
        this.APIUrl = _APIUrl;
    }
}
