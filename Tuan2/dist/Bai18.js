"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.fetchUser = fetchUser;
exports.bai18 = bai18;
const utils_1 = require("./utils");
async function fetchUser(id) {
    await (0, utils_1.delay)(1000);
    return { id, name: `user #${id}` };
}
async function bai18() {
    const u = await fetchUser(7);
    console.log("Bài 18:", u);
}
