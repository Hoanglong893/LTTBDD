import { fetchUser } from "./Bai18";

export async function fetchUsers(ids: number[]) {
    return Promise.all(ids.map((id) => fetchUser(id)));
}

export async function bai19() {
    const users = await fetchUsers([1, 2, 3, 4]);
    console.log("Bài 19:", users);
}
