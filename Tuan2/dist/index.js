"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const Bai1_1 = require("./Bai1");
const Bai2_1 = require("./Bai2");
const Bai3_1 = require("./Bai3");
// import {Bai4} from "./Bai4";
const Bai6_1 = require("./Bai6");
const Bai7_1 = require("./Bai7");
const Bai8_1 = require("./Bai8");
const Bai9_1 = require("./Bai9");
const Bai10_1 = require("./Bai10");
function main() {
    return __awaiter(this, void 0, void 0, function* () {
        console.log("Bai 1:", yield (0, Bai1_1.Bai1)());
        console.log("Bai 2:", yield (0, Bai2_1.Bai2)());
        try {
            yield (0, Bai3_1.Bai3)();
        }
        catch (err) {
            console.error("Bai3 error:", err);
        }
        // await Bai4();
        console.log("Bai 5:", "Task done");
        console.log("Bai 6:", yield (0, Bai6_1.Bai6)());
        console.log("Bai 7:", yield (0, Bai7_1.Bai7)());
        console.log("Bai 8:", yield (0, Bai8_1.Bai8)());
        console.log("Bai 9:", yield (0, Bai9_1.Bai9)([1, 2, 3, 4, 5, 6]));
        yield (0, Bai10_1.Bai10)();
    });
}
main();
