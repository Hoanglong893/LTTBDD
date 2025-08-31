import { delay } from "./utils";

async function tripleAfter1s(n: number) {
    await delay(1000);
    return n * 3;
}

export async function bai16() {
    console.time("Bài 16 (parallel)");
    const [a, b, c] = await Promise.all([
        tripleAfter1s(1),
        tripleAfter1s(2),
        tripleAfter1s(3),
    ]);
    console.timeEnd("Bài 16 (parallel)");
    console.log("Bài 16:", { a, b, c });
}
