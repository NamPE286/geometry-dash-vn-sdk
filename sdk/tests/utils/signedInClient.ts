import { Client } from "#sdk/mod.ts";

/**
 * Create new signed in Geometry Dash VN client
 * @param serviceRole Whether to use service role Supabase API Key
 * @returns Signed in Geometry Dash VN client
 */
export default async function (role: string = "default") {
    const client = new Client(
        Deno.env.get("SUPABASE_API_URL")!,
        Deno.env.get("SUPABASE_ANON_KEY")!,
        Deno.env.get("API_URL")!,
    );

    const client1 = new Client(
        Deno.env.get("SUPABASE_API_URL")!,
        Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!,
        Deno.env.get("API_URL")!,
    );

    await client.db.auth.signUp({
        email: "test@bitbucket.local",
        password: "123456",
    });

    const { data } = await client.db.auth.signInWithPassword({
        email: "test@bitbucket.local",
        password: "123456",
    });

    const res = await client1.db
        .from("users")
        .insert({ user_id: data.user?.id, name: "test", role: role });

    if (res.error) {
        await client1.db
            .from("users")
            .update({ user_id: data.user?.id, name: "test", role: role })
            .match({ user_id: data.user?.id });
    }

    await client1.db.auth.stopAutoRefresh();

    return client;
}
