type Todo = { userId: number; id: number; title: string; completed: boolean };

export async function bai21() {
    try {
        const res = await fetch("https://jsonplaceholder.typicode.com/todos/1");
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        const todo: Todo = await res.json();
        console.log("Bài 21:", todo);
    } catch (e) {
        console.error("Bài 21 error:", (e as Error).message);
    }
}
