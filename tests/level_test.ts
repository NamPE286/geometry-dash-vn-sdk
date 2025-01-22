import { client } from "#sdk/utils/client.ts";
import { assertEquals } from "@std/assert/equals";

Deno.test("Get level by ID", async () => {
    const level = await client.level.get(52374843);

    assertEquals(JSON.parse(JSON.stringify(level)), {
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
});

Deno.test("Get level rating", async () => {
    const res = (await client.level.get(52374843)).getRating("demon");

    assertEquals(JSON.parse(JSON.stringify(res)), {
        id: 52374843,
        list: "demon",
        rating: 3000,
        min_progress: 60,
    });

    const res1 = (await client.level.get(52374843)).getRating("nonExistence");

    assertEquals(res1, undefined);
});
