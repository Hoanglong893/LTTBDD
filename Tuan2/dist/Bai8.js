"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Bai8 = Bai8;
function Bai8() {
    return Promise.resolve(2)
        .then((n) => n * n)
        .then((n) => n * 2)
        .then((n) => n + 5);
}
