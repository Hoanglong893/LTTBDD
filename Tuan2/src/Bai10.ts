import {simulateTask} from "./Bai5";

export function Bai10(): Promise<void>{
    return simulateTask(1500)
        .then((msg) => console.log(msg))
        .catch((err) => console.error(err))
        .finally(() => console.log("Done"));
}