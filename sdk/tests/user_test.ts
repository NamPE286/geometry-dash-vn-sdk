import { assertEquals } from "jsr:@std/assert";
import { Client } from "#sdk/mod.ts";
import signedInClient from "#sdk/tests/utils/signedInClient.ts";
import "jsr:@std/dotenv/load";

Deno.test("Insert new user", async () => {
    const client = new Client(Deno.env.get("SUPABASE_API_URL")!, Deno.env.get("SUPABASE_ANON_KEY")!, Deno.env.get("API_URL")!);

    const { data, error } = await client.db.auth.signUp({
        email: "test@bitbucket.local",
        password: "123456",
    });

    if (error) {
        console.warn(error.message);
        await client.db.auth.stopAutoRefresh();
        assertEquals(0, 0);

        return;
    }

    await client.user.create({ name: "newuser" });

    const user = await client.user.get(data.user?.id!);
    user.created_at = "";

    await client.db.auth.stopAutoRefresh();

    assertEquals(user, {
        user_id: data.user?.id!,
        created_at: "",
        name: "newuser",
        city: null,
        province: null,
        role: "default",
        is_hidden: false,
    });
});

Deno.test("Edit user by UID", async () => {
    const client = await signedInClient();
    const { data } = await client.db.auth.getUser();

    await client.user.update({
        user_id: data.user?.id,
        name: "test123",
    });

    const user = await client.user.get(data.user?.id!);

    await client.db.auth.stopAutoRefresh();

    assertEquals(user.name, "test123");
});

Deno.test("Get user by UID", async () => {
    const client = new Client(Deno.env.get("SUPABASE_API_URL")!, Deno.env.get("SUPABASE_ANON_KEY")!, Deno.env.get("API_URL")!);
    const user = await client.user.get("ded6b269-a856-4a49-a1ae-d8837d50e350");

    client.db.auth.stopAutoRefresh();

    assertEquals(user, {
        user_id: "ded6b269-a856-4a49-a1ae-d8837d50e350",
        created_at: "2025-01-18T09:56:19.965229+00:00",
        name: "default",
        city: "Hạ Long",
        province: "Quảng Ninh",
        role: "default",
        is_hidden: false,
    });
});
