"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.bai21 = bai21;
async function bai21() {
    try {
        const res = await fetch("https://jsonplaceholder.typicode.com/todos/1");
        if (!res.ok)
            throw new Error(`HTTP ${res.status}`);
        const todo = await res.json();
        console.log("Bài 21:", todo);
    }
    catch (e) {
        console.error("Bài 21 error:", e.message);
    }
}
