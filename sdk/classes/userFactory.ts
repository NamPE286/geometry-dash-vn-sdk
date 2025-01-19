import type { SupabaseClient } from "@supabase/supabase-js";
import type { Database } from "#types/supabase.ts";

type User = Database["public"]["Tables"]["users"];

/** User factory class */
export class UserFactory {
    private db: SupabaseClient<Database>;
    private APIUrl: string;

    async get(uid: string): Promise<User["Row"]> {
        const { data, error } = await this.db
            .from("users")
            .select("*")
            .eq("user_id", uid)
            .single();

        if (error) {
            throw error;
        }

        return data;
    }

    async add(obj: User["Insert"]): Promise<void> {
        const { error } = await this.db
            .from("users")
            .insert(obj);

        if (error) {
            throw error;
        }
    }

    async update(obj: User["Update"]): Promise<void> {
        const res = await fetch(`${this.APIUrl}/user`, {
            method: "PATCH",
            headers: {
                "Content-Type": "application/json",
                Authorization: "Bearer " + (await this.db.auth.getSession()).data.session?.access_token,
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
