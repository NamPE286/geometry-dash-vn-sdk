import { assertEquals } from "jsr:@std/assert";
import { createClient as _createClient } from "@supabase/supabase-js";
import { cleanup, createClient } from "../utils/client.ts";
import type { Database } from "#types/supabase.ts";
import "jsr:@std/dotenv/load";

const supabase = _createClient<Database>(Deno.env.get("SUPABASE_API_URL")!, Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!);

Deno.test("Insert new user", async () => {
    const client = await createClient(false);

    const { data, error } = await client.db.auth.signUp({
        email: "test@bitbucket.local",
        password: "123456",
    });

    if (error) {
        throw error;
    }

    await client.user.create({ name: "newuser" });

    const user = await client.user.get(data.user?.id!);
    user.created_at = "";

    assertEquals(user, {
        user_id: data.user?.id!,
        created_at: "",
        name: "newuser",
        city: null,
        province: null,
        role: "default",
        is_hidden: false,
    });

    await client.db.auth.stopAutoRefresh();
    await supabase.auth.admin.deleteUser(data.user?.id!);
});

Deno.test("Edit user by UID", async () => {
    const client = await createClient(true);
    const { data } = await client.db.auth.getUser();

    await client.user.update({
        user_id: data.user?.id,
        name: "test123",
    });

    const user = await client.user.get(data.user?.id!);

    assertEquals(user.name, "test123");

    await cleanup(client);
});

Deno.test("Get user by UID", async () => {
    const client = await createClient(false);
    const user = await client.user.get("ded6b269-a856-4a49-a1ae-d8837d50e350");

    assertEquals(user, {
        user_id: "ded6b269-a856-4a49-a1ae-d8837d50e350",
        created_at: "2025-01-18T09:56:19.965229+00:00",
        name: "default",
        city: "Hạ Long",
        province: "Quảng Ninh",
        role: "default",
        is_hidden: false,
    });

    await cleanup(client);
});
