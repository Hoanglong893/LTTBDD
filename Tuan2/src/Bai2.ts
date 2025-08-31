export function Bai2(): Promise<number>{
    return new Promise((resovle) => {
        setTimeout(() => resovle(10), 1000);
    });
}