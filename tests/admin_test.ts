import { client, signInClient, signOutClient } from "#src/utils/client.ts";

Deno.test("Database refresh", async () => {
    try {
        await signInClient("admin");
        await client.admin.refresh();
    } catch (err) {
        await signOutClient();
        throw err;
    }

    await signOutClient();
});
