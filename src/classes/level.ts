import type { SupabaseClient } from "@supabase/supabase-js";
import type { Database, Tables } from "#src/types/supabase.ts";

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

    async add(data: TLevel["Insert"]): Promise<void> {
        const res = await fetch(`${this.APIUrl}/level`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                Authorization: "Bearer " +
                    (await this.db.auth.getSession()).data.session?.access_token,
            },
            body: JSON.stringify(data),
        });

        await res.body?.cancel();

        if (!(200 <= res.status && res.status < 300)) {
            throw new Error("API error: " + String(res.status));
        }
    }

    constructor(_db: SupabaseClient<Database>, _APIUrl: string) {
        this.db = _db;
        this.APIUrl = _APIUrl;
    }
}
