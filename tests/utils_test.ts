import { Cache } from "#src/utils/cache.ts";
import { assertEquals } from "@std/assert/equals";

Deno.test("Cache utils", () => {
    const cache = new Cache<[string, number], number>();

    cache.set(["abc", 123], 12345);

    assertEquals(cache.get("abc", 123), 12345);
});
