import type { SupabaseClient } from "@supabase/supabase-js";
import type { Database } from "#types/supabase.ts";

type TUser = Database["public"]["Tables"]["users"];
type TUserData = TUser["Row"];

export class UserData {
    data: TUserData;

    constructor(data: TUserData) {
        this.data = data;
    }
}

export class User {
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

        return new UserData(data);
    }

    async create(obj: TUser["Update"]): Promise<void> {
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
            throw new Error(String(res.status));
        }

        await res.body?.cancel();
    }

    async update(obj: TUser["Update"]): Promise<void> {
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
    }

    constructor(_db: SupabaseClient<Database>, _APIUrl: string) {
        this.db = _db;
        this.APIUrl = _APIUrl;
    }
}
