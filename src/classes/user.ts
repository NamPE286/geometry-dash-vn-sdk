import type { SupabaseClient } from "@supabase/supabase-js";
import type { Database, Tables, TablesUpdate } from "#src/types/supabase.ts";

export type UserRecord = Tables<"records_view"> & { user: Tables<"users"> | null };

export class UserRecords {
    private db: SupabaseClient<Database>;
    private map: Map<string, UserRecord> = new Map<string, UserRecord>();
    private userID: string;

    data: UserRecord[];

    async fetch(list: string, {
        range = { start: 0, end: 50 },
        ascending = false,
    }: {
        range?: { start: number; end: number };
        ascending?: boolean;
    } = {}): Promise<UserRecord[]> {
        const { data, error } = await this.db
            .from("records_view")
            .select("*, user:users(*)")
            .match({ user_id: this.userID, list: list })
            .order("point", { ascending: ascending })
            .range(range.start, range.end);

        if (error) {
            throw error;
        }

        this.data = data;

        return data;
    }

    async fetchSingle(levelID: number, list: string): Promise<UserRecord> {
        if (this.map.has(JSON.stringify([this.userID, list]))) {
            return this.map.get(JSON.stringify([this.userID, list]))!;
        }

        const { data, error } = await this.db
            .from("records_view")
            .select("*, user:users(*)")
            .match({ level_id: levelID, user_id: this.userID, list: list })
            .single();

        if (error) {
            throw error;
        }

        return data;
    }

    constructor(db: SupabaseClient<Database>, userID: string, data: UserRecord[]) {
        this.db = db;
        this.userID = userID;
        this.data = data;

        for (const i of data) {
            this.map.set(JSON.stringify([i.user_id, i.list]), i);
        }
    }
}

export class UserData {
    data: Tables<"users">;
    records: UserRecords;

    constructor(
        db: SupabaseClient<Database>,
        data: Tables<"users">,
        records: UserRecord[] = [],
    ) {
        this.data = data;
        this.records = new UserRecords(db, data.user_id, records);
    }
}

export class Users {
    private db: SupabaseClient<Database>;
    private APIUrl: string;

    async get(uid: string): Promise<UserData> {
        const { data, error } = await this.db
            .from("users")
            .select("*")
            .eq("user_id", uid)
            .single();

        if (error) {
            throw error;
        }

        return new UserData(this.db, data);
    }

    // Use TablesUpdate type because user id will be taken from token
    async create(obj: TablesUpdate<"users">): Promise<void> {
        const res = await fetch(`${this.APIUrl}/user`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                Authorization: "Bearer " +
                    (await this.db.auth.getSession()).data.session?.access_token,
            },
            body: JSON.stringify(obj),
        });

        if (!(200 <= res.status && res.status < 300)) {
            throw new Error("API error: " + String(res.status));
        }

        await res.body?.cancel();
    }

    async update(obj: TablesUpdate<"users">): Promise<void> {
        const res = await fetch(`${this.APIUrl}/user`, {
            method: "PATCH",
            headers: {
                "Content-Type": "application/json",
                Authorization: "Bearer " +
                    (await this.db.auth.getSession()).data.session?.access_token,
            },
            body: JSON.stringify(obj),
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
