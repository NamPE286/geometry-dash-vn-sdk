import { createClient as _createClient } from "@supabase/supabase-js";
import type { Database } from "#types/supabase.ts";
import { UserFactory } from "#sdk/classes/userFactory.ts";
import type { SupabaseClient } from "@supabase/supabase-js";

/** Geometry Dash VN client class */
export class Client {
    private APIUrl: string;
    db: SupabaseClient<Database>;
    user: UserFactory;

    /**
     * Create new client
     * @param supabaseAPIUrl Supabase API URL
     * @param supabaseAPIKey Supabase API Key
     * @param APIUrl Authentication required function API URL
     */
    constructor(supabaseAPIUrl: string, supabaseAPIKey: string, APIUrl: string) {
        this.db = _createClient<Database>(supabaseAPIUrl, supabaseAPIKey);
        this.APIUrl = APIUrl;
        this.user = new UserFactory(this.db, this.APIUrl);
    }
}
