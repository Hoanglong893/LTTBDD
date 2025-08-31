export function Bai1(): Promise<string>{
    return new Promise((resovle) => {
        setTimeout(() => resovle("Hello Async"), 2000);
    });
}