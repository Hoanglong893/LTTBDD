"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.bai16 = bai16;
const utils_1 = require("./utils");
async function tripleAfter1s(n) {
    await (0, utils_1.delay)(1000);
    return n * 3;
}
async function bai16() {
    console.time("Bài 16 (parallel)");
    const [a, b, c] = await Promise.all([
        tripleAfter1s(1),
        tripleAfter1s(2),
        tripleAfter1s(3),
    ]);
    console.timeEnd("Bài 16 (parallel)");
    console.log("Bài 16:", { a, b, c });
}
