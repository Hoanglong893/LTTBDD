"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Bai6 = Bai6;
const Bai5_1 = require("./Bai5");
function Bai6() {
    return Promise.all([
        (0, Bai5_1.simulateTask)(1000),
        (0, Bai5_1.simulateTask)(2000),
        (0, Bai5_1.simulateTask)(3000),
    ]);
}
