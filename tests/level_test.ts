import { server, setupTest } from "./utils/environment.ts";
import { assertEquals } from "@std/assert/equals";
import { assert } from "@std/assert/assert";
import type { Tables } from "#src/types/supabase.ts";

Deno.test("Get level by ID", async () => {
    await setupTest({
        fn: async (client) => {
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
        fn: async (client) => {
            const level = await client.levels.fetch(79484035);
            const res: Tables<"users">[] = [];

            for (const i of level.creators.data) {
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
        fn: async (client) => {
            const level = await client.levels.fetch(52374843);

            assertEquals(level.ratings.get("demon"), {
                id: 52374843,
                list: "demon",
                rating: 3500,
                min_progress: 60,
            });
            assertEquals(level.ratings.get("nonExistence"), undefined);
        },
    });
});

Deno.test("Get level's records", async () => {
    await setupTest({
        fn: async (client) => {
            const level = await client.levels.fetch(52374843);
            const records = await level.records.fetch("demon", { range: { start: 0, end: 1 } });

            for (const i of records) {
                i.exp = i.point = i.no = 0;
            }

            assertEquals(records, [
                {
                    user_id: "fa49b543-083c-4577-958f-ca86a8e295bd",
                    level_id: 52374843,
                    video_link: "https://www.youtube.com/watch?v=7GJOBkIgWHc",
                    progress: 100,
                    list: "demon",
                    point: 0,
                    no: 0,
                    exp: 0,
                    level: {
                        id: 52374843,
                        name: "Zodiac",
                        created_at: "2025-01-19T18:16:01.572288+00:00",
                        creator_alt: "Bianox and more",
                        youtube_video_id: "FX9paD5rRsM",
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
                    no: 0,
                    exp: 0,
                    level: {
                        id: 52374843,
                        name: "Zodiac",
                        created_at: "2025-01-19T18:16:01.572288+00:00",
                        creator_alt: "Bianox and more",
                        youtube_video_id: "FX9paD5rRsM",
                    },
                },
            ]);
        },
    });
});

Deno.test("Get level's record by user id", async () => {
    await setupTest({
        fn: async (client) => {
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
                level: {
                    id: 52374843,
                    name: "Zodiac",
                    created_at: "2025-01-19T18:16:01.572288+00:00",
                    creator_alt: "Bianox and more",
                    youtube_video_id: "FX9paD5rRsM",
                },
            });
        },
    });
});

Deno.test("Get list", async () => {
    await setupTest({
        fn: async (client) => {
            const list = await client.levels.fetchList("demon", {
                range: { start: 0, end: 2 },
                userID: "ded6b269-a856-4a49-a1ae-d8837d50e350",
            });
            const res: {
                data: Tables<"levels">;
                creators: (Tables<"level_creator"> & { user: Tables<"users"> })[];
            }[] = [];

            for (const i of list) {
                const creators: (Tables<"level_creator"> & { user: Tables<"users"> })[] = [];

                for (const j of i.creators.data) {
                    const { user, ...creator } = j;
                    creators.push({ ...creator, user: user.data });
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
                            user: {
                                city: null,
                                name: "Onvil",
                                role: "default",
                                user_id: "570eef3f-5510-4b72-94f7-b5d325a70d11",
                                province: null,
                                is_hidden: false,
                                created_at: "2025-01-26T11:19:35.451648+00:00",
                            },
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

Deno.test("Insert new level", async () => {
    await setupTest({
        signedIn: true,
        role: "admin",
        fn: async (client) => {
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
        fn: async (client) => {
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
        fn: async (client) => {
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
