import { delay } from "./utils";

async function tripleAfter1s(n: number) {
    await delay(1000);
    return n * 3;
}

export async function bai15() {
    console.time("Bài 15 (sequential)");
    const a = await tripleAfter1s(1);
    const b = await tripleAfter1s(2);
    const c = await tripleAfter1s(3);
    console.timeEnd("Bài 15 (sequential)");
    console.log("Bài 15:", { a, b, c });
}
