import { server, setupTest } from "./utils/environment.ts";
import { assertEquals } from "@std/assert/equals";
import type { Client } from "#src/mod.ts";

Deno.test("Get level by ID", async () => {
    await setupTest({
        fn: async (client: Client) => {
            const { data } = await client.level.get(52374843);

            assertEquals(data, {
                id: 52374843,
                created_at: "2025-01-19T18:16:01.572288+00:00",
                name: "Zodiac",
                creator: "Bianox and more",
                youtube_video_id: "FX9paD5rRsM",
            });
        },
    });
});

Deno.test("Get level rating", async () => {
    await setupTest({
        fn: async (client: Client) => {
            const res = (await client.level.get(52374843)).getRating("demon");

            assertEquals(res, {
                id: 52374843,
                list: "demon",
                rating: 3000,
                min_progress: 60,
            });

            const res1 = (await client.level.get(52374843)).getRating("nonExistence");

            assertEquals(res1, undefined);
        },
    });
});

Deno.test("Insert new level", async () => {
    await setupTest({
        signedIn: true,
        role: "admin",
        fn: async (client: Client) => {
            try {
                await client.level.add({
                    id: 123,
                    name: "newlevel",
                    creator: "testcreator",
                    youtube_video_id: "test",
                });

                const { data } = await client.level.get(123);
                data.created_at = "";

                assertEquals(data, {
                    id: 123,
                    created_at: "",
                    name: "newlevel",
                    creator: "testcreator",
                    youtube_video_id: "test",
                });
            } catch (err) {
                await server
                    .from("levels")
                    .delete()
                    .eq("id", 123);

                throw err;
            }

            await server
                .from("levels")
                .delete()
                .eq("id", 123);
        },
    });
});
