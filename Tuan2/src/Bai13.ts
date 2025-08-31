import { delay } from "./utils";

function failAfter1s(): Promise<never> {
    return new Promise((_, reject) =>
        setTimeout(() => reject(new Error("Something went wrong")), 1000)
    );
}

export async function bai13() {
    try {
        await failAfter1s();
        console.log("Bài 13: should not reach here");
    } catch (e) {
        console.log("Bài 13 (caught):", (e as Error).message);
    }
}
