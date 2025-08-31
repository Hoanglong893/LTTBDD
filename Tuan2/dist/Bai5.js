"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.simulateTask = simulateTask;
function simulateTask(time) {
    return new Promise((resovle) => {
        setTimeout(() => resovle("Task done"), time);
    });
}
