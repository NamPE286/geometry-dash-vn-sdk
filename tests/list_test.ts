import { assertEquals } from "@std/assert/equals";
import { setupTest } from "./utils/environment.ts";
import type { Client } from "#src/mod.ts";
import type { Tables } from "#src/types/supabase.ts";

Deno.test("Get list", async () => {
    await setupTest({
        fn: async (client: Client) => {
            const list = await client.list.getLevels("demon", {
                range: { start: 0, end: 1 },
                userID: "ded6b269-a856-4a49-a1ae-d8837d50e350",
            });
            const res: Tables<"levels">[] = [];

            for (const i of list) {
                res.push(i.data);
            }

            assertEquals(res, [
                {
                    id: 71025973,
                    name: "Oblivion",
                    creator_alt: "dice88 & more",
                    created_at: "2025-01-18T10:25:33.965152+00:00",
                    youtube_video_id: "bsWqS5QPhz8",
                },
                {
                    id: 52374843,
                    name: "Zodiac",
                    creator_alt: "Bianox and more",
                    created_at: "2025-01-19T18:16:01.572288+00:00",
                    youtube_video_id: "FX9paD5rRsM",
                },
            ]);
        },
    });
});
