import { cleanup, createSignedInClient } from "#sdk/utils/client.ts";

Deno.test("Database refresh", async () => {
    const client = await createSignedInClient("admin");

    await client.admin.refresh();

    await cleanup(client);
});
