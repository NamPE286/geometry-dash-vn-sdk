import type { SupabaseClient } from "@supabase/supabase-js";
import type { Database, Tables } from "#src/types/supabase.ts";

export type TLevel = Database["public"]["Tables"]["levels"];
export type TLevelData = TLevel["Row"] & { ratings: Tables<"level_rating">[] };

export class LevelData {
    private db: SupabaseClient<Database>;
    private ratingMap = new Map<string, Tables<"level_rating">>();
    private recordMap = new Map<string, Tables<"records_view">>();
    data: TLevelData;

    getRating(list: string): Tables<"level_rating"> | undefined {
        return this.ratingMap.get(list);
    }

    async getRecord(userID: string): Promise<Tables<"records_view">> {
        if (this.recordMap.has(userID)) {
            return this.recordMap.get(userID)!;
        }

        const { data, error } = await this.db
            .from("records_view")
            .select("*")
            .match({ level_id: this.data.id, user_id: userID })
            .single();

        if (error) {
            throw error;
        }

        return data;
    }

    constructor(
        db: SupabaseClient<Database>,
        data: TLevelData,
        records: Tables<"records_view">[] = [],
    ) {
        this.db = db;
        this.data = data;

        for (const i of data.ratings) {
            this.ratingMap.set(i.list, i);
        }

        for (const i of records) {
            this.recordMap.set(i.user_id!, i);
        }
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

        return new LevelData(this.db, data);
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

    async update(data: TLevel["Update"]): Promise<void> {
        // TODO
    }

    async delete(id: number): Promise<void> {
        // TODO
    }

    constructor(_db: SupabaseClient<Database>, _APIUrl: string) {
        this.db = _db;
        this.APIUrl = _APIUrl;
    }
}
