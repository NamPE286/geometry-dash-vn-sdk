import type { SupabaseClient } from "@supabase/supabase-js";
import type { Database, Tables } from "#types/supabase.ts";

type TLevel = Database["public"]["Tables"]["levels"];
type TLevelData = TLevel["Row"] & { ratings: Tables<"level_rating">[] };

export class LevelData {
    data: TLevelData;
    private ratingMap: Map<string, Tables<"level_rating">> | null = null;

    getRating(list: string): Tables<"level_rating"> | undefined {
        if (this.ratingMap === null) {
            this.ratingMap = new Map<string, Tables<"level_rating">>();

            for (const i of this.data.ratings) {
                this.ratingMap.set(i.list, i);
            }
        }

        return this.ratingMap.get(list);
    }

    constructor(data: TLevelData) {
        this.data = data;
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
