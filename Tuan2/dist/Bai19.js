"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.fetchUsers = fetchUsers;
exports.bai19 = bai19;
const Bai18_1 = require("./Bai18");
async function fetchUsers(ids) {
    return Promise.all(ids.map((id) => (0, Bai18_1.fetchUser)(id)));
}
async function bai19() {
    const users = await fetchUsers([1, 2, 3, 4]);
    console.log("Bài 19:", users);
}
