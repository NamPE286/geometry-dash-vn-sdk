import { Client } from "#src/mod.ts";
import { createClient } from "@supabase/supabase-js";
import type { Database } from "#src/types/supabase.ts";
import "jsr:@std/dotenv/load";
import { assert } from "@std/assert/assert";

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

export async function setupTest(
    { signedIn = false, role = "default", fn }: {
        signedIn?: boolean;
        role?: string;
        fn: (client: Client) => Promise<void>;
    },
) {
    if (signedIn) {
        await signInClient(role);
    }

    try {
        await fn(client);
    } catch (err) {
        if (signedIn) {
            await signOutClient();
        }

        throw err;
    }

    if (!signedIn) {
        return;
    }

    await signOutClient();

    try {
        await fn(client);

        assert(false, "Authentication bypassed");
    } catch (err) {
        if (err instanceof Error && err.name == "AssertionError") {
            throw err;
        }
    }

    if (role === "default") {
        return;
    }

    await signInClient("default");

    try {
        await fn(client);

        assert(false, "User's role is not checked");
    } catch (err) {
        if (err instanceof Error && err.name == "AssertionError") {
            throw err;
        }
    }

    await signOutClient();
}
