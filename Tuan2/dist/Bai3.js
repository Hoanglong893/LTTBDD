"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Bai3 = Bai3;
function Bai3() {
    return new Promise((_, reject) => {
        setTimeout(() => reject(new Error("Something went wrong")), 1000);
    });
}
