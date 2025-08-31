"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.bai22 = bai22;
async function bai22() {
    try {
        const ids = [1, 2, 3, 4, 5];
        const requests = ids.map((id) => fetch(`https://jsonplaceholder.typicode.com/todos/${id}`).then((r) => {
            if (!r.ok)
                throw new Error(`HTTP ${r.status} for id=${id}`);
            return r.json();
        }));
        const todos = await Promise.all(requests);
        console.log("Bài 22:", todos);
    }
    catch (e) {
        console.error("Bài 22 error:", e.message);
    }
}
