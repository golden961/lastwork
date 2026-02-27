const API_URL = import.meta.env.VITE_API_URL;

export async function apiFetch(path, { method = "GET", token, body } = {}) {
    const headers = { "Content-Type": "application/json" };
    if (token) headers.Authorization = `Bearer ${token}`;

    const res = await fetch(`${API_URL}${path}`, {
        method,
        headers,
        body: body ? JSON.stringify(body) : undefined,
    });

    let data = null;
    try {
        data = await res.json();
    } catch {
        // ok
    }

    if (!res.ok) {
        const message = data?.message || `HTTP ${res.status}`;
        const errors = data?.errors || null;
        const err = new Error(message);
        err.status = res.status;
        err.errors = errors;
        throw err;
    }

    return data;
}