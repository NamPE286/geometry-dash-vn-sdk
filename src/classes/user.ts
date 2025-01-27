import type { SupabaseClient } from "@supabase/supabase-js";
import type { Database, Tables, TablesUpdate } from "#src/types/supabase.ts";

export class UserRecords {
    private db: SupabaseClient<Database>;
    private userID: string;

    data: Tables<"records_view">[];

    async fetch({
        range = { start: 0, end: 50 },
        list = "demon",
        ascending = false,
    }: {
        range?: { start: number; end: number };
        list?: string;
        ascending?: boolean;
    } = {}) {
        // TODO
    }

    constructor(db: SupabaseClient<Database>, userID: string, data: Tables<"records_view">[]) {
        this.db = db;
        this.userID = userID;
        this.data = data;
    }
}

export class UserData {
    data: Tables<"users">;
    records: UserRecords;

    constructor(
        db: SupabaseClient<Database>,
        data: Tables<"users">,
        records: Tables<"records_view">[] = [],
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
