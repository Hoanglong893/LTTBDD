import { delay } from "./utils";

async function tripleAfter(ms: number, n: number) {
    await delay(ms);
    return n * 3;
}

export async function bai17() {
    const promises = [
        tripleAfter(300, 2),
        tripleAfter(1000, 5),
        tripleAfter(600, 4),
    ];

    console.log("Bài 17:");
    for await (const val of promises) {
        console.log(" ->", val);
    }
}
