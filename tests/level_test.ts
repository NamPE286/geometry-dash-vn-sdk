import { server, setupTest } from "./utils/environment.ts";
import { assertEquals } from "@std/assert/equals";
import type { Client } from "#src/mod.ts";
import { assert } from "@std/assert/assert";
import type { Tables } from "#src/types/supabase.ts";

Deno.test("Get level by ID", async () => {
    await setupTest({
        fn: async (client: Client) => {
            const level = await client.levels.fetch(52374843);

            assertEquals(level.data, {
                id: 52374843,
                created_at: "2025-01-19T18:16:01.572288+00:00",
                name: "Zodiac",
                creator_alt: "Bianox and more",
                youtube_video_id: "FX9paD5rRsM",
            });
        },
    });
});

Deno.test("Get level's creator", async () => {
    await setupTest({
        fn: async (client: Client) => {
            const level = await client.levels.fetch(79484035);
            const res: Tables<"users">[] = [];

            for (const i of level.creators) {
                res.push(i.user.data);
            }

            assertEquals(res, [
                {
                    city: null,
                    name: "Onvil",
                    role: "default",
                    user_id: "570eef3f-5510-4b72-94f7-b5d325a70d11",
                    province: null,
                    is_hidden: false,
                    created_at: "2025-01-26T11:19:35.451648+00:00",
                },
            ]);
        },
    });
});

Deno.test("Get level's rating", async () => {
    await setupTest({
        fn: async (client: Client) => {
            const level = await client.levels.fetch(52374843);

            assertEquals(level.ratings.cache.get("demon"), {
                id: 52374843,
                list: "demon",
                rating: 3500,
                min_progress: 60,
            });
            assertEquals(level.ratings.cache.get("nonExistence"), undefined);
        },
    });
});

Deno.test("Get level's records", async () => {
    await setupTest({
        fn: async (client: Client) => {
            const level = await client.levels.fetch(52374843);
            const records = await level.records.fetch({ range: { start: 0, end: 1 } });

            for (const i of records.data) {
                i.exp = i.point = i.no = 0;
            }

            assertEquals(records.data, [
                {
                    user_id: "fa49b543-083c-4577-958f-ca86a8e295bd",
                    level_id: 52374843,
                    video_link: "https://www.youtube.com/watch?v=7GJOBkIgWHc",
                    progress: 100,
                    list: "demon",
                    point: 0,
                    no: 0,
                    exp: 0,
                },
                {
                    user_id: "ded6b269-a856-4a49-a1ae-d8837d50e350",
                    level_id: 52374843,
                    video_link:
                        "https://www.youtube.com/watch?v=uCuSX3Y004E&pp=ygUKcHJpcyBtYWdpYw%3D%3D",
                    progress: 87,
                    list: "demon",
                    point: 0,
                    no: 0,
                    exp: 0,
                },
            ]);
        },
    });
});

Deno.test("Get level's record by user id", async () => {
    await setupTest({
        fn: async (client: Client) => {
            const level = await client.levels.fetch(52374843);
            const record = await level.records.fetchSingle(
                "ded6b269-a856-4a49-a1ae-d8837d50e350",
                "demon",
            );

            record!.point = record!.exp = record!.no = 0;

            assertEquals(record, {
                user_id: "ded6b269-a856-4a49-a1ae-d8837d50e350",
                level_id: 52374843,
                video_link:
                    "https://www.youtube.com/watch?v=uCuSX3Y004E&pp=ygUKcHJpcyBtYWdpYw%3D%3D",
                progress: 87,
                list: "demon",
                point: 0,
                no: 0,
                exp: 0,
            });

            assertEquals(
                level.records.cache.get("ded6b269-a856-4a49-a1ae-d8837d50e350", "demon"),
                record,
            );
        },
    });
});

Deno.test("Insert new level", async () => {
    await setupTest({
        signedIn: true,
        role: "admin",
        fn: async (client: Client) => {
            try {
                await client.levels.add({
                    id: 123,
                    name: "newlevel",
                    creator_alt: "testcreator",
                    youtube_video_id: "test",
                });

                const { data } = await client.levels.fetch(123);
                data.created_at = "";

                assertEquals(data, {
                    id: 123,
                    created_at: "",
                    name: "newlevel",
                    creator_alt: "testcreator",
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

Deno.test("Edit level", async () => {
    await setupTest({
        signedIn: true,
        role: "admin",
        fn: async (client: Client) => {
            await client.levels.add({
                id: 123,
                name: "newlevel",
                creator_alt: "testcreator",
                youtube_video_id: "test",
            });

            try {
                await client.levels.update({
                    id: 123,
                    name: "newlevel123",
                });

                const { data } = await client.levels.fetch(123);

                assertEquals(data.name, "newlevel123");
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

Deno.test("Delete level", async () => {
    await setupTest({
        signedIn: true,
        role: "admin",
        fn: async (client: Client) => {
            await client.levels.add({
                id: 123,
                name: "newlevel",
                creator_alt: "testcreator",
                youtube_video_id: "test",
            });

            try {
                await client.levels.delete(123);
            } catch (err) {
                await server
                    .from("levels")
                    .delete()
                    .eq("id", 123);

                throw err;
            }

            try {
                await client.levels.fetch(123);
            } catch {
                return;
            }

            assert(false);
        },
    });
});
