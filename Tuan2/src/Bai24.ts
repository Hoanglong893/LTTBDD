type PostPayload = { title: string; body: string; userId: number };

export async function postData(payload: PostPayload) {
    const res = await fetch("https://jsonplaceholder.typicode.com/posts", {
        method: "POST",
        headers: { "Content-Type": "application/json; charset=UTF-8" },
        body: JSON.stringify(payload),
    });
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    return res.json();
}

export async function bai24() {
    try {
        const result = await postData({
        title: "Hello",
        body: "World",
        userId: 1,
        });
        console.log("Bài 24:", result);
    } catch (e) {
        console.error("Bài 24 error:", (e as Error).message);
    }
}
