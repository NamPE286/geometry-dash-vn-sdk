import { setupTest } from "./utils/environment.ts";
import type { Client } from "#src/mod.ts";

Deno.test("Database refresh", async () => {
    await setupTest({
        signedIn: true,
        role: "admin",
        fn: async (client: Client) => {
            await client.admin.refresh();
        },
    });
});
