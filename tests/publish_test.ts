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

    if (code !== 0) {
        console.error(new TextDecoder().decode(stderr));
        throw new Error("Failed to publish package");
    }
});
