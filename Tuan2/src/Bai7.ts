import {simulateTask} from "./Bai5";

export function Bai7(): Promise<string>{
    return Promise.race([
        simulateTask(1000),
        simulateTask(2000),
        simulateTask(3000),
    ]);
}