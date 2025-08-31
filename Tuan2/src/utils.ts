export const delay = (ms: number) =>
    new Promise<void>((resolve) => setTimeout(resolve, ms));

export async function simulateTask(time: number): Promise<string> {
    await delay(time);
    return "Task done";
}

export function withTimeout<T>(p: Promise<T>, ms: number): Promise<T> {
    return Promise.race<T>([
        p,
        new Promise<T>((_, reject) =>
            setTimeout(() => reject(new Error(`Timeout after ${ms}ms`)), ms)
        ),
    ]);
}
