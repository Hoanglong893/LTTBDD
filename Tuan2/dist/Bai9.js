"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Bai9 = Bai9;
function Bai9(arr) {
    return new Promise((resolve) => {
        setTimeout(() => resolve(arr.filter((n) => n % 2 === 0)), 1000);
    });
}
