"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Bai1 = Bai1;
function Bai1() {
    return new Promise((resovle) => {
        setTimeout(() => resovle("Hello Async"), 2000);
    });
}
