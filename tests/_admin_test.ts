import { setupTest } from "./utils/environment.ts";

Deno.test("Database refresh", async () => {
    await setupTest({
        signedIn: true,
        role: "admin",
        fn: async (client) => {
            await client.admin.refresh();
        },
    });
});
