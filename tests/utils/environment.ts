import { signInClient, signOutClient } from "./client.ts";

export async function setup(
    { signedIn = false, fn }: { signedIn: boolean; fn: () => Promise<void> },
) {
    if (signedIn) {
        await signInClient();
    }

    try {
        await fn();
    } catch (err) {
        if (signedIn) {
            await signOutClient();
        }

        throw err;
    }

    if (signedIn) {
        await signOutClient();
    }
}
