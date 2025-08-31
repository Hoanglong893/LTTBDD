"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.bai14 = bai14;
const utils_1 = require("./utils");
async function tripleAfter1s(n) {
    await (0, utils_1.delay)(1000);
    return n * 3;
}
async function bai14() {
    const out = await tripleAfter1s(5);
    console.log("Bài 14:", out); // 15
}
