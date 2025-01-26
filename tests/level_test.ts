import { server, setupTest } from "./utils/environment.ts";
import { assertEquals } from "@std/assert/equals";
import type { Client } from "#src/mod.ts";
import { assert } from "@std/assert/assert";

Deno.test("Get level by ID", async () => {
    await setupTest({
        fn: async (client: Client) => {
            const level = await client.level.get(52374843);

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

Deno.test("Get level's rating", async () => {
    await setupTest({
        fn: async (client: Client) => {
            const res = await (await client.level.get(52374843)).getRating("demon");

            assertEquals(res, {
                id: 52374843,
                list: "demon",
                rating: 3500,
                min_progress: 60,
            });

            try {
                await (await client.level.get(52374843)).getRating("nonExistence");
                assert(false);
            } catch (err) {
                if (err instanceof Object && "code" in err) {
                    assert(err.code === "PGRST116");
                    return;
                }

                throw err;
            }
        },
    });
});

Deno.test("Get level's records", async () => {
    await setupTest({
        fn: async (client: Client) => {
            const level = await client.level.get(52374843);
            const records = await level.getRecords({ range: { start: 0, end: 1 } });

            for (const i of records) {
                i.exp = i.point = 0;
            }

            assertEquals(records, [
                {
                    user_id: "fa49b543-083c-4577-958f-ca86a8e295bd",
                    level_id: 52374843,
                    video_link: "https://www.youtube.com/watch?v=7GJOBkIgWHc",
                    progress: 100,
                    list: "demon",
                    point: 0,
                    no: 1,
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
                    no: 2,
                    exp: 0,
                },
            ]);
        },
    });
});

Deno.test("Get level's record by user id", async () => {
    await setupTest({
        fn: async (client: Client) => {
            const level = await client.level.get(52374843);
            const record = await level.getRecord("demon", "ded6b269-a856-4a49-a1ae-d8837d50e350");

            record.point = record.exp = 0;

            assertEquals(record, {
                user_id: "ded6b269-a856-4a49-a1ae-d8837d50e350",
                level_id: 52374843,
                video_link:
                    "https://www.youtube.com/watch?v=uCuSX3Y004E&pp=ygUKcHJpcyBtYWdpYw%3D%3D",
                progress: 87,
                list: "demon",
                point: 0,
                no: 2,
                exp: 0,
            });
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
                    creator_alt: "testcreator",
                    youtube_video_id: "test",
                });

                const { data } = await client.level.get(123);
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
            await client.level.add({
                id: 123,
                name: "newlevel",
                creator_alt: "testcreator",
                youtube_video_id: "test",
            });

            try {
                await client.level.update({
                    id: 123,
                    name: "newlevel123",
                });

                const { data } = await client.level.get(123);

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
            await client.level.add({
                id: 123,
                name: "newlevel",
                creator_alt: "testcreator",
                youtube_video_id: "test",
            });

            try {
                await client.level.delete(123);
            } catch (err) {
                await server
                    .from("levels")
                    .delete()
                    .eq("id", 123);

                throw err;
            }

            try {
                await client.level.get(123);
            } catch {
                return;
            }

            assert(false);
        },
    });
});
