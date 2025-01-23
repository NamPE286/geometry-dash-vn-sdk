import { assertEquals } from "jsr:@std/assert";
import { setupTest, signOutClient } from "./utils/environment.ts";
import "jsr:@std/dotenv/load";
import type { Client } from "#src/mod.ts";

Deno.test("Insert new user", async () => {
    await setupTest({
        signedIn: false,
        fn: async (client: Client) => {
            try {
                const { data, error } = await client.db.auth.signUp({
                    email: "test@bitbucket.local",
                    password: "123456",
                });

                if (error) {
                    throw error;
                }

                await client.user.create({ name: "newuser" });

                const { data: user } = await client.user.get(data.user?.id!);
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
            } catch (err) {
                await signOutClient();

                throw err;
            }

            await signOutClient();
        },
    });
});

Deno.test("Edit user by UID", async () => {
    await setupTest({
        signedIn: true,
        fn: async (client: Client) => {
            const { data } = await client.db.auth.getUser();

            await client.user.update({
                user_id: data.user?.id,
                name: "test123",
            });

            const { data: user } = await client.user.get(data.user?.id!);

            assertEquals(user.name, "test123");
        },
    });
});

Deno.test("Get user by UID", async () => {
    await setupTest({
        signedIn: false,
        fn: async (client: Client) => {
            const { data } = await client.user.get("ded6b269-a856-4a49-a1ae-d8837d50e350");

            assertEquals(data, {
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
});
