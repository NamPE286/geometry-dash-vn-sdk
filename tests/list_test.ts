import { assertEquals } from "@std/assert/equals";
import { setupTest } from "./utils/environment.ts";
import type { Client } from "#src/mod.ts";
import type { Tables } from "#src/types/supabase.ts";

Deno.test("Get list", async () => {
    await setupTest({
        fn: async (client: Client) => {
            const list = await client.list.getLevels("demon", {
                range: { start: 0, end: 2 },
                userID: "ded6b269-a856-4a49-a1ae-d8837d50e350",
            });
            const res: {
                data: Tables<"levels">;
                creators: Tables<"level_creator">[];
            }[] = [];

            for (const i of list) {
                const creators: Tables<"level_creator">[] = [];

                for (const j of i.creators) {
                    const { user: _user, ...creator } = j;
                    creators.push(creator);
                }

                res.push({ data: i.data, creators: creators });
            }

            assertEquals(res, [
                {
                    data: {
                        id: 71025973,
                        name: "Oblivion",
                        created_at: "2025-01-18T10:25:33.965152+00:00",
                        creator_alt: "dice88 & more",
                        youtube_video_id: "bsWqS5QPhz8",
                    },
                    creators: [],
                },
                {
                    data: {
                        id: 52374843,
                        name: "Zodiac",
                        created_at: "2025-01-19T18:16:01.572288+00:00",
                        creator_alt: "Bianox and more",
                        youtube_video_id: "FX9paD5rRsM",
                    },
                    creators: [],
                },
                {
                    data: {
                        id: 79484035,
                        name: "The Moon Below",
                        created_at: "2025-01-26T11:17:35.230536+00:00",
                        creator_alt: "Onvil",
                        youtube_video_id: "4JA0NXdo4Wc",
                    },
                    creators: [
                        {
                            user_id: "570eef3f-5510-4b72-94f7-b5d325a70d11",
                            level_id: 79484035,
                            part_end: 100,
                            part_start: 0,
                            is_decorator: true,
                            is_gameplay_maker: true,
                        },
                    ],
                },
            ]);
        },
    });
});
