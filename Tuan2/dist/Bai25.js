"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.bai25 = bai25;
const utils_1 = require("./utils");
async function bai25() {
    console.log("Bài 25: Downloading file...");
    await (0, utils_1.delay)(3000);
    console.log("Bài 25: File downloaded!");
}
