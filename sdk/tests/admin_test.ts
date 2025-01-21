import { cleanup, createClient } from "#sdk/utils/client.ts";

Deno.test("Database refresh", async () => {
    const client = await createClient(true, "admin");

    await client.admin.refresh();

    await cleanup(client);
});
