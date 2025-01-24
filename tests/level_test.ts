import { server, setupTest } from "./utils/environment.ts";
import { assertEquals } from "@std/assert/equals";
import type { Client } from "#src/mod.ts";

Deno.test("Get level by ID", async () => {
    await setupTest({
        fn: async (client: Client) => {
            const level = await client.level.get(52374843);

            assertEquals(level.data, {
                id: 52374843,
                created_at: "2025-01-19T18:16:01.572288+00:00",
                name: "Zodiac",
                creator: "Bianox and more",
                youtube_video_id: "FX9paD5rRsM",
            });
        },
    });
});

Deno.test("Get level's rating", async () => {
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

Deno.test("Get level's records", async () => {
    await setupTest({
        fn: async (client: Client) => {
            const level = await client.level.get(52374843);
            const records = await level.getRecords({ range: { start: 0, end: 1 } });

            assertEquals(records, [
                {
                    user_id: "fa49b543-083c-4577-958f-ca86a8e295bd",
                    level_id: 52374843,
                    video_link: "https://www.youtube.com/watch?v=7GJOBkIgWHc",
                    progress: 100,
                    list: "demon",
                    point: 3000,
                    no: 1,
                },
                {
                    user_id: "ded6b269-a856-4a49-a1ae-d8837d50e350",
                    level_id: 52374843,
                    video_link:
                        "https://www.youtube.com/watch?v=uCuSX3Y004E&pp=ygUKcHJpcyBtYWdpYw%3D%3D",
                    progress: 87,
                    list: "demon",
                    point: 1740,
                    no: 2,
                },
            ]);
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
