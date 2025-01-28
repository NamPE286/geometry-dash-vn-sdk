import type { SupabaseClient } from "@supabase/supabase-js";
import type { Database, Tables, TablesInsert, TablesUpdate } from "#src/types/supabase.ts";
import { UserData } from "#src/classes/user.ts";

export class LevelRatings {
    private map: Map<string, Tables<"level_rating">> = new Map<string, Tables<"level_rating">>();

    public data: Tables<"level_rating">[];

    get(list: string): Tables<"level_rating"> | undefined {
        return this.map.get(list);
    }

    constructor(data: Tables<"level_rating">[]) {
        this.data = data;

        for (const i of data) {
            this.map.set(i.list, i);
        }
    }
}

export type LevelRecord = Tables<"records_view"> & { level: Tables<"levels"> | null };

export class LevelRecords {
    private db: SupabaseClient<Database>;
    private id: number;

    public map: Map<string, LevelRecord> = new Map<string, LevelRecord>();
    public data: Tables<"records_view">[];

    async fetch(list: string, {
        range = { start: 0, end: 50 },
        ascending = false,
    }: {
        range?: { start: number; end: number };
        ascending?: boolean;
    }): Promise<LevelRecord[]> {
        const { data, error } = await this.db
            .from("records_view")
            .select("*, level:levels(*)")
            .match({ level_id: this.id, list: list })
            .order("point", { ascending: ascending })
            .range(range.start, range.end);

        if (error) {
            throw error;
        }

        return data;
    }

    async fetchSingle(userID: string, list: string): Promise<LevelRecord> {
        if (this.map.has(JSON.stringify([userID, list]))) {
            return this.map.get(JSON.stringify([userID, list]))!;
        }

        const { data, error } = await this.db
            .from("records_view")
            .select("*, level:levels(*)")
            .match({ level_id: this.id, user_id: userID, list: list })
            .single();

        if (error) {
            throw error;
        }

        return data;
    }

    constructor(
        db: SupabaseClient<Database>,
        levelID: number,
        data: LevelRecord[],
    ) {
        this.db = db;
        this.id = levelID;
        this.data = data;

        for (const i of data) {
            this.map.set(JSON.stringify([i.user_id, i.list]), i);
        }
    }
}

export class LevelCreators {
    public data: (Tables<"level_creator"> & { user: UserData })[];

    constructor(
        db: SupabaseClient<Database>,
        data: (Tables<"level_creator"> & { user: Tables<"users"> })[],
    ) {
        this.data = [];

        for (const i of data) {
            const { user, ...creator } = i;
            this.data.push({ ...creator, user: new UserData(db, user) });
        }
    }
}

export class LevelData {
    public data: Tables<"levels">;
    public ratings: LevelRatings;
    public records: LevelRecords;
    public creators: LevelCreators;

    constructor(
        db: SupabaseClient<Database>,
        data: Tables<"levels">,
        creators: (Tables<"level_creator"> & { user: Tables<"users"> })[] = [],
        ratings: Tables<"level_rating">[] = [],
        records: LevelRecord[] = [],
    ) {
        this.data = data;
        this.ratings = new LevelRatings(ratings);
        this.records = new LevelRecords(db, data.id, records);
        this.creators = new LevelCreators(db, creators);
    }
}

interface ListFilter {
    range?: { start: number; end: number };
    userID?: string;
}

export class Levels {
    private db: SupabaseClient<Database>;
    private APIUrl: string;

    async fetch(id: number): Promise<LevelData> {
        const { data, error } = await this.db
            .from("levels")
            .select("*, level_rating(*), level_creator(*, user:users(*))")
            .eq("id", id)
            .single();

        if (error) {
            throw error;
        }

        const { level_rating, level_creator, ...level } = data;

        return new LevelData(this.db, level, level_creator, level_rating);
    }

    async fetchList(
        list: string,
        {
            range = { start: 0, end: 50 },
            userID = "00000000-0000-0000-0000-000000000000",
        }: ListFilter,
    ): Promise<LevelData[]> {
        const { data, error } = await this.db
            .from("level_rating")
            .select(
                "*, levels(*, level_rating(*), records_view(*, level:levels(*)), level_creator(*, user:users(*)))",
            )
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
            const { level_rating, level_creator, records_view, ...level } = i.levels;
            res.push(new LevelData(this.db, level, level_creator, level_rating, records_view));
        }

        return res;
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
