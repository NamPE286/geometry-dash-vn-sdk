import { createClient as _createClient } from "@supabase/supabase-js";
import type { Database } from "#src/types/supabase.ts";
import { User } from "#src/classes/user.ts";
import type { SupabaseClient } from "@supabase/supabase-js";
import { Admin } from "#src/classes/admin.ts";
import { Level } from "#src/classes/level.ts";
import { List } from "#src/classes/list.ts";

/** Geometry Dash VN client class */
export class Client {
    private APIUrl: string;
    db: SupabaseClient<Database>;
    user: User;
    admin: Admin;
    level: Level;
    list: List;

    /**
     * Create new client
     * @param supabaseAPIUrl Supabase API URL
     * @param supabaseAPIKey Supabase API Key
     * @param APIUrl Authentication required function API URL
     */
    constructor(supabaseAPIUrl: string, supabaseAPIKey: string, APIUrl: string) {
        this.db = _createClient<Database>(supabaseAPIUrl, supabaseAPIKey);
        this.APIUrl = APIUrl;
        this.user = new User(this.db, this.APIUrl);
        this.admin = new Admin(this.db, this.APIUrl);
        this.level = new Level(this.db, this.APIUrl);
        this.list = new List(this.db, this.APIUrl);
    }
}
