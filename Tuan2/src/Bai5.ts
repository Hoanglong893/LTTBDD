export function simulateTask(time:number): Promise<string>{
    return new Promise((resovle) => {
        setTimeout(() => resovle("Task done"), time);
    });
}