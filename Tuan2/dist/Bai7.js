"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Bai7 = Bai7;
const Bai5_1 = require("./Bai5");
function Bai7() {
    return Promise.race([
        (0, Bai5_1.simulateTask)(1000),
        (0, Bai5_1.simulateTask)(2000),
        (0, Bai5_1.simulateTask)(3000),
    ]);
}
