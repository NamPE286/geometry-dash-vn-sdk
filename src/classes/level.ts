import type { SupabaseClient } from "@supabase/supabase-js";
import type { Database, Tables, TablesInsert, TablesUpdate } from "#src/types/supabase.ts";
import { UserData } from "#src/classes/user.ts";

export class LevelData {
    private db: SupabaseClient<Database>;
    private ratingMap = new Map<string, Tables<"level_rating">>();
    private recordMap = new Map<string, Tables<"records_view">>();

    data: Tables<"levels">;
    creators: (Tables<"level_creator"> & { user: UserData })[] = [];

    async getRating(list: string): Promise<Tables<"level_rating">> {
        if (this.ratingMap.has(list)) {
            return this.ratingMap.get(list)!;
        }

        const { data, error } = await this.db
            .from("level_rating")
            .select("*")
            .match({ id: this.data.id, list: list })
            .single();

        if (error) {
            throw error;
        }

        return data;
    }

    async getRecords({
        range = { start: 0, end: 50 },
        list = "demon",
        ascending = false,
    }: {
        range?: { start: number; end: number };
        list?: string;
        ascending?: boolean;
    } = {}): Promise<Tables<"records_view">[]> {
        const { data, error } = await this.db
            .from("records_view")
            .select("*")
            .match({ level_id: this.data.id, list: list })
            .order("point", { ascending: ascending })
            .range(range.start, range.end);

        if (error) {
            throw error;
        }

        this.recordMap.clear();

        for (const i of data) {
            this.recordMap.set(JSON.stringify([i.list!, i.user_id!]), i);
        }

        return data;
    }

    async getRecord(list: string, userID: string): Promise<Tables<"records_view">> {
        if (this.recordMap.has(JSON.stringify([list, userID]))) {
            return this.recordMap.get(JSON.stringify([list, userID]))!;
        }

        const { data, error } = await this.db
            .from("records_view")
            .select("*")
            .match({ level_id: this.data.id, user_id: userID });

        if (error) {
            throw error;
        }

        for (const i of data) {
            this.recordMap.set(JSON.stringify([i.list!, userID]), i);
        }

        return this.recordMap.get(JSON.stringify([list, userID]))!;
    }

    constructor(
        db: SupabaseClient<Database>,
        data: Tables<"levels">,
        creators: (Tables<"level_creator"> & { data: Tables<"users"> })[],
        ratings: Tables<"level_rating">[] = [],
        records: Tables<"records_view">[] = [],
    ) {
        this.db = db;
        this.data = data;

        for (const i of ratings) {
            this.ratingMap.set(i.list, i);
        }

        for (const i of records) {
            this.recordMap.set(JSON.stringify([i.list!, i.user_id!]), i);
        }

        for (const i of creators) {
            const { data, ...creator } = i;
            this.creators.push({ ...creator, user: new UserData(db, data) });
        }
    }
}

export class Level {
    private db: SupabaseClient<Database>;
    private APIUrl: string;

    async get(id: number): Promise<LevelData> {
        const { data, error } = await this.db
            .from("levels")
            .select("*, level_rating(*), level_creator(*, data:users(*))")
            .eq("id", id)
            .single();

        if (error) {
            throw error;
        }

        const { level_rating, level_creator, ...level } = data;

        return new LevelData(this.db, level, level_creator, level_rating);
    }

    async add(data: TablesInsert<"levels">): Promise<void> {
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

    async update(data: TablesUpdate<"levels">): Promise<void> {
        const res = await fetch(`${this.APIUrl}/level`, {
            method: "PATCH",
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

    async delete(id: number): Promise<void> {
        const res = await fetch(`${this.APIUrl}/level/${id}`, {
            method: "DELETE",
            headers: {
                Authorization: "Bearer " +
                    (await this.db.auth.getSession()).data.session?.access_token,
            },
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
