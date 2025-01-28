import { assertEquals } from "jsr:@std/assert";
import { setupTest, signOutClient } from "./utils/environment.ts";
import "jsr:@std/dotenv/load";

Deno.test("Insert new user", async () => {
    await setupTest({
        fn: async (client) => {
            try {
                const { data, error } = await client.db.auth.signUp({
                    email: "test@bitbucket.local",
                    password: "123456",
                });

                if (error) {
                    throw error;
                }

                await client.users.create({ name: "newuser" });

                const { data: user } = await client.users.get(data.user?.id!);
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
        fn: async (client) => {
            const { data } = await client.db.auth.getUser();

            await client.users.update({
                user_id: data.user?.id,
                name: "test123",
            });

            const { data: user } = await client.users.get(data.user?.id!);

            assertEquals(user.name, "test123");
        },
    });
});

Deno.test("Fetch user by UID", async () => {
    await setupTest({
        fn: async (client) => {
            const { data } = await client.users.get("ded6b269-a856-4a49-a1ae-d8837d50e350");

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

Deno.test("Fetch user's record", async () => {
    await setupTest({
        fn: async (client) => {
            const user = await client.users.get("ded6b269-a856-4a49-a1ae-d8837d50e350");
            const records = await user.records.fetch("demon");

            for (const i of records) {
                i.exp = i.point = 0;
            }

            assertEquals(records, [
                {
                    user_id: "ded6b269-a856-4a49-a1ae-d8837d50e350",
                    level_id: 71025973,
                    video_link: "https://www.youtube.com/watch?v=c7E-tgmFuzw&pp=ygUIcG9wIGluIDI%3D",
                    progress: 100,
                    list: "demon",
                    point: 0,
                    exp: 0,
                    user: {
                        city: "Hạ Long",
                        name: "default",
                        role: "default",
                        user_id: "ded6b269-a856-4a49-a1ae-d8837d50e350",
                        province: "Quảng Ninh",
                        is_hidden: false,
                        created_at: "2025-01-18T09:56:19.965229+00:00",
                    },
                },
                {
                    user_id: "ded6b269-a856-4a49-a1ae-d8837d50e350",
                    level_id: 79484035,
                    video_link: "https://www.youtube.com/watch?v=yJWaKc703jc",
                    progress: 100,
                    list: "demon",
                    point: 0,
                    exp: 0,
                    user: {
                        city: "Hạ Long",
                        name: "default",
                        role: "default",
                        user_id: "ded6b269-a856-4a49-a1ae-d8837d50e350",
                        province: "Quảng Ninh",
                        is_hidden: false,
                        created_at: "2025-01-18T09:56:19.965229+00:00",
                    },
                },
                {
                    user_id: "ded6b269-a856-4a49-a1ae-d8837d50e350",
                    level_id: 52374843,
                    video_link:
                        "https://www.youtube.com/watch?v=uCuSX3Y004E&pp=ygUKcHJpcyBtYWdpYw%3D%3D",
                    progress: 87,
                    list: "demon",
                    point: 0,
                    exp: 0,
                    user: {
                        city: "Hạ Long",
                        name: "default",
                        role: "default",
                        user_id: "ded6b269-a856-4a49-a1ae-d8837d50e350",
                        province: "Quảng Ninh",
                        is_hidden: false,
                        created_at: "2025-01-18T09:56:19.965229+00:00",
                    },
                },
            ]);
        },
    });
});
