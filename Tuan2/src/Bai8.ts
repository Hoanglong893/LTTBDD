export function Bai8(): Promise<number>{
    return Promise.resolve(2)
    .then((n) => n * n)
    .then((n) => n * 2)
    .then((n) => n + 5);
}