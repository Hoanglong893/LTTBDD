"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.postData = postData;
exports.bai24 = bai24;
async function postData(payload) {
    const res = await fetch("https://jsonplaceholder.typicode.com/posts", {
        method: "POST",
        headers: { "Content-Type": "application/json; charset=UTF-8" },
        body: JSON.stringify(payload),
    });
    if (!res.ok)
        throw new Error(`HTTP ${res.status}`);
    return res.json();
}
async function bai24() {
    try {
        const result = await postData({
            title: "Hello",
            body: "World",
            userId: 1,
        });
        console.log("Bài 24:", result);
    }
    catch (e) {
        console.error("Bài 24 error:", e.message);
    }
}
