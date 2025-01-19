import { assertEquals } from "jsr:@std/assert";
import { Client } from "#sdk/main.ts";
import signedInClient from "#sdk/tests/utils/signedInClient.ts";
import "jsr:@std/dotenv/load";

Deno.test({
    name: "Edit user by UID",
    fn: async () => {
        const client = await signedInClient();
        const { data } = await client.db.auth.getUser();

        await client.user.update({
            user_id: data.user?.id,
            name: "test123",
        });

        const user = await client.user.get(data.user?.id!);

        client.db.auth.stopAutoRefresh();

        assertEquals(user.name, "test123");
    },
});

Deno.test({
    name: "Get user by UID",
    fn: async () => {
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
    },
});
