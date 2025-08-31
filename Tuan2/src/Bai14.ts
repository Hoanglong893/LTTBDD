import { delay } from "./utils";

async function tripleAfter1s(n: number): Promise<number> {
    await delay(1000);
    return n * 3;
}

export async function bai14() {
    const out = await tripleAfter1s(5);
    console.log("Bài 14:", out); // 15
}
