import { client, server, setupTest, signInClient, signOutClient } from "./utils/environment.ts";
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
                ratings: [
                    { id: 52374843, list: "demon", rating: 3000, min_progress: 60 },
                    { id: 52374843, list: "featured", rating: 1000, min_progress: 100 },
                ],
            });
        },
    });
});

Deno.test("Get level rating", async () => {
    const res = (await client.level.get(52374843)).getRating("demon");

    assertEquals(res, {
        id: 52374843,
        list: "demon",
        rating: 3000,
        min_progress: 60,
    });

    const res1 = (await client.level.get(52374843)).getRating("nonExistence");

    assertEquals(res1, undefined);
});

Deno.test("Insert new level", async () => {
    await signInClient("admin");

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
            ratings: [],
        });
    } catch (err) {
        await server
            .from("levels")
            .delete()
            .eq("id", 123);

        await signOutClient();

        throw err;
    }

    await server
        .from("levels")
        .delete()
        .eq("id", 123);

    await signOutClient();
});
