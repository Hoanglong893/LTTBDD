import {simulateTask} from "./Bai5";

export function Bai6(): Promise<string[]>{
    return Promise.all([
        simulateTask(1000),
        simulateTask(2000),
        simulateTask(3000),
    ]);
}