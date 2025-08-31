import { delay } from "./utils";

type User = { id: number; name: string };

export async function fetchUser(id: number): Promise<User> {
    await delay(1000);
    return { id, name: `user #${id}` };
}

export async function bai18() {
    const u = await fetchUser(7);
    console.log("Bài 18:", u);
}
