import type { TLevelData } from "#src/classes/level.ts";
import { assertEquals } from "@std/assert/equals";
import { setupTest } from "./utils/environment.ts";
import type { Client } from "#src/mod.ts";

Deno.test("Get list", async () => {
    await setupTest({
        fn: async (client: Client) => {
            const list = await client.list.getLevels("demon", { start: 0, end: 1 });
            const res: TLevelData[] = [];

            for (const i of list) {
                res.push(i.data);
            }

            assertEquals(res, [
                {
                    id: 71025973,
                    name: "Oblivion",
                    creator: "dice88 & more",
                    ratings: [
                        { id: 71025973, list: "demon", rating: 4100, min_progress: 60 },
                    ],
                    created_at: "2025-01-18T10:25:33.965152+00:00",
                    youtube_video_id: "bsWqS5QPhz8",
                },
                {
                    id: 52374843,
                    name: "Zodiac",
                    creator: "Bianox and more",
                    ratings: [
                        { id: 52374843, list: "demon", rating: 3000, min_progress: 60 },
                        {
                            id: 52374843,
                            list: "featured",
                            rating: 1000,
                            min_progress: 100,
                        },
                    ],
                    created_at: "2025-01-19T18:16:01.572288+00:00",
                    youtube_video_id: "FX9paD5rRsM",
                },
            ]);
        },
    });
});
