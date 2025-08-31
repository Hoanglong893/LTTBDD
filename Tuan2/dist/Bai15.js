"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.bai15 = bai15;
const utils_1 = require("./utils");
async function tripleAfter1s(n) {
    await (0, utils_1.delay)(1000);
    return n * 3;
}
async function bai15() {
    console.time("Bài 15 (sequential)");
    const a = await tripleAfter1s(1);
    const b = await tripleAfter1s(2);
    const c = await tripleAfter1s(3);
    console.timeEnd("Bài 15 (sequential)");
    console.log("Bài 15:", { a, b, c });
}
