"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.bai13 = bai13;
function failAfter1s() {
    return new Promise((_, reject) => setTimeout(() => reject(new Error("Something went wrong")), 1000));
}
async function bai13() {
    try {
        await failAfter1s();
        console.log("Bài 13: should not reach here");
    }
    catch (e) {
        console.log("Bài 13 (caught):", e.message);
    }
}
