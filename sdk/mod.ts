import { createClient as _createClient } from "@supabase/supabase-js";
import type { Database } from "#types/supabase.ts";
import { UserFactory } from "#sdk/classes/userFactory.ts";
import type { SupabaseClient } from "@supabase/supabase-js";

export class Client {
    private APIUrl: string;
    db: SupabaseClient<Database>;
    user: UserFactory;

    constructor(supabaseAPIUrl: string, supabaseAPIKey: string, APIUrl: string) {
        this.db = _createClient<Database>(supabaseAPIUrl, supabaseAPIKey);
        this.APIUrl = APIUrl;
        this.user = new UserFactory(this.db, this.APIUrl);   
    }
}
