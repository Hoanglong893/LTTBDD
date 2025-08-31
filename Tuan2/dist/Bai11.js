"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.bai11 = bai11;
const utils_1 = require("./utils");
async function bai11() {
    await (0, utils_1.delay)(2000);
    const msg = "Hello Async";
    console.log("Bài 11:", msg);
}
