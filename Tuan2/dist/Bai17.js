"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.bai17 = bai17;
const utils_1 = require("./utils");
async function tripleAfter(ms, n) {
    await (0, utils_1.delay)(ms);
    return n * 3;
}
async function bai17() {
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
