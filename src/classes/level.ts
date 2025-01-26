import type { SupabaseClient } from "@supabase/supabase-js";
import type { Database, Tables, TablesInsert, TablesUpdate } from "#src/types/supabase.ts";
import { UserData } from "#src/classes/user.ts";

export class LevelRating {
    private db: SupabaseClient<Database>;
    private id: number;

    public cache = new Map<string, Tables<"level_rating">>();

    /**
     * Update cache and get level's list rating
     * @param list Name of the list
     * @returns Level's list rating
     */
    async fetch(list: string | null = null): Promise<Tables<"level_rating"> | undefined> {
        const { data, error } = await this.db
            .from("level_rating")
            .select("*")
            .match({ id: this.id });

        if (error) {
            throw error;
        }

        for (const i of data) {
            this.cache.set(i.list, i);
        }

        if (list === null) {
            return undefined;
        }

        return this.cache.get(list);
    }

    /**
     * @param db Supabase client
     * @param levelID ID of the level
     * @param cache Data to preload cache with
     */
    constructor(
        db: SupabaseClient<Database>,
        levelID: number,
        cache: Tables<"level_rating">[] = [],
    ) {
        this.db = db;
        this.id = levelID;

        for (const i of cache) {
            this.cache.set(i.list, i);
        }
    }
}

export class LevelCreator {
    private db: SupabaseClient<Database>;
    private id: number;

    public cache: Tables<"level_creator">[];

    /**
     * Update and return cache
     * @returns Level's list rating
     */
    async fetch(): Promise<Tables<"level_creator">[]> {
        const { data, error } = await this.db
            .from("level_creator")
            .select("*")
            .eq("id", this.id);

        if (error) {
            throw error;
        }

        this.cache = data;

        return this.cache;
    }

    /**
     * @param db Supabase client
     * @param levelID ID of the level
     * @param cache Data to preload cache with
     */
    constructor(
        db: SupabaseClient<Database>,
        levelID: number,
        cache: Tables<"level_creator">[] = [],
    ) {
        this.db = db;
        this.id = levelID;
        this.cache = cache;
    }
}

export class LevelData {
    private db: SupabaseClient<Database>;
    private ratingMap = new Map<string, Tables<"level_rating">>();
    private recordMap = new Map<string, Tables<"records_view">>();

    public data: Tables<"levels">;
    public creators: (Tables<"level_creator"> & { user: UserData })[] = [];

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
