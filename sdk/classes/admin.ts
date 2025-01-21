import type { SupabaseClient } from "@supabase/supabase-js";
import type { Database } from "#types/supabase.ts";

export class Admin {
    private db: SupabaseClient<Database>;
    private APIUrl: string;

    async refresh() {
        const res = await fetch(`${this.APIUrl}/func/refresh`, {
            method: "PATCH",
            headers: {
                Authorization: "Bearer " + (await this.db.auth.getSession()).data.session?.access_token,
            },
        });

        if (!(200 <= res.status && res.status < 300)) {
            throw new Error(String(res.status));
        }

        await res.body?.cancel();
    }

    constructor(_db: SupabaseClient<Database>, _APIUrl: string) {
        this.db = _db;
        this.APIUrl = _APIUrl;
    }
}
