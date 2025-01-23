import { assert } from "@std/assert/assert";

Deno.test("Publish to JSR", async () => {
    const command = new Deno.Command("deno", {
        args: [
            "publish",
            "--dry-run",
            "--allow-dirty",
        ],
    });

    // create subprocess and collect output
    const { code, stderr } = await command.output();

    console.log(new TextDecoder().decode(stderr));
    assert(code === 0, "Failed to publish package");
});
