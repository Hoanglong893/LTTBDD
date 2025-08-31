"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Bai4 = Bai4;
function Bai4() {
    return new Promise((resolve, reject) => {
        const num = Math.floor(Math.random() * 100);
        if (num >= 0) {
            console.log("Random number: ", num);
            resolve();
        }
        else {
            reject("Invalid number");
        }
    }).catch((err) => console.error("Error:", err));
}
