type Todo = { userId: number; id: number; title: string; completed: boolean };

export async function bai23() {
    try {
        const res = await fetch("https://jsonplaceholder.typicode.com/todos");
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        const todos: Todo[] = await res.json();
        const completed = todos.filter((t) => t.completed);
        console.log("Bài 23 - Completed:", completed.slice(0, 5)); // in 5 cái đầu thôi
    } catch (e) {
        console.error("Bài 23 error:", (e as Error).message);
    }
}
