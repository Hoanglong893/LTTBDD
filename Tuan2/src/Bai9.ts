export function Bai9(arr: number[]): Promise<number[]>{
    return new Promise((resolve) => {
        setTimeout(() => resolve(arr.filter((n) => n % 2 === 0)), 1000)
    });
}