type Todo = { userId: number; id: number; title: string; completed: boolean };

export async function bai22() {
    try {
        const ids = [1, 2, 3, 4, 5];
        const requests = ids.map((id) =>
        fetch(`https://jsonplaceholder.typicode.com/todos/${id}`).then((r) => {
            if (!r.ok) throw new Error(`HTTP ${r.status} for id=${id}`);
            return r.json() as Promise<Todo>;
        })
        );
        const todos = await Promise.all(requests);
        console.log("Bài 22:", todos);
    } catch (e) {
        console.error("Bài 22 error:", (e as Error).message);
    }
}
