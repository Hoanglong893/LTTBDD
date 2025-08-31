"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Bai10 = Bai10;
const Bai5_1 = require("./Bai5");
function Bai10() {
    return (0, Bai5_1.simulateTask)(1500)
        .then((msg) => console.log(msg))
        .catch((err) => console.error(err))
        .finally(() => console.log("Done"));
}
