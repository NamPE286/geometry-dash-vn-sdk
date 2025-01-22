import { Client } from "#src/mod.ts";
import { createClient } from "@supabase/supabase-js";
import type { Database } from "#types/supabase.ts";
import "jsr:@std/dotenv/load";

export const client = new Client(
    Deno.env.get("SUPABASE_API_URL")!,
    Deno.env.get("SUPABASE_ANON_KEY")!,
    Deno.env.get("API_URL")!,
);

export const server = createClient<Database>(
    Deno.env.get("SUPABASE_API_URL")!,
    Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!,
);

export async function signInClient(role: string = "default") {
    await server.auth.admin.createUser({
        email: "test@bitbucket.local",
        password: "123456",
        email_confirm: true,
    });

    const { data } = await client.db.auth.signInWithPassword({
        email: "test@bitbucket.local",
        password: "123456",
    });

    await server
        .from("users")
        .insert({ user_id: data.user?.id!, name: "test", role: role });

    return client;
}

export async function signOutClient() {
    const { data } = await client.db.auth.getUser();

    await server
        .from("users")
        .delete()
        .eq("user_id", data.user!.id);

    await server.auth.admin.deleteUser(data.user!.id);
}
