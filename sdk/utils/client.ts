import { Client } from "#sdk/mod.ts";
import { createClient as _createClient } from "@supabase/supabase-js";
import type { Database } from "#types/supabase.ts";
import "jsr:@std/dotenv/load";

export async function createClient(signedIn: boolean = false, role: string = "default") {
    if (!signedIn) {
        return new Client(
            Deno.env.get("SUPABASE_API_URL")!,
            Deno.env.get("SUPABASE_ANON_KEY")!,
            Deno.env.get("API_URL")!,
        );
    }

    const supabase = _createClient<Database>(Deno.env.get("SUPABASE_API_URL")!, Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!);
    const client = new Client(
        Deno.env.get("SUPABASE_API_URL")!,
        Deno.env.get("SUPABASE_ANON_KEY")!,
        Deno.env.get("API_URL")!,
    );

    await supabase.auth.admin.createUser({
        email: "test@bitbucket.local",
        password: "123456",
        email_confirm: true,
    });

    const { data } = await client.db.auth.signInWithPassword({
        email: "test@bitbucket.local",
        password: "123456",
    });

    await supabase
        .from("users")
        .insert({ user_id: data.user?.id, name: "test", role: role });

    await supabase.auth.stopAutoRefresh();

    return client;
}

export async function cleanup(client: Client) {
    const supabase = _createClient<Database>(Deno.env.get("SUPABASE_API_URL")!, Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!);

    const { data } = await client.db.auth.signInWithPassword({
        email: "test@bitbucket.local",
        password: "123456",
    });

    if (data.user) {
        await supabase
            .from("users")
            .delete()
            .eq("user_id", data.user.id);

        await supabase.auth.admin.deleteUser(data.user.id);
    }

    await client.db.auth.stopAutoRefresh();
    await supabase.auth.stopAutoRefresh();
}
