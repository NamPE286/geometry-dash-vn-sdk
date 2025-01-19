import { Client } from "#sdk/mod.ts";

export default async function (serviceRole: boolean = false) {
    const client = new Client(
        Deno.env.get("SUPABASE_API_URL")!,
        Deno.env.get(serviceRole ? "SUPABASE_SERVICE_ROLE_KEY" : "SUPABASE_ANON_KEY")!,
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

    const res = await client.db
        .from("users")
        .insert({ user_id: data.user?.id, name: "test" });

    if (res.error) {
        await client.user.update({ user_id: data.user?.id, name: "test" });
    }

    return client;
}
