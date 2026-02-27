import { http } from "./http";
import { EP } from "./endpoints";

// нормализация: чтобы работало с любым форматом ответа
export function normalizeAuthResponse(data) {
    const token =
        data?.token ||
        data?.accessToken ||
        data?.jwt ||
        data?.data?.token ||
        data?.data?.accessToken ||
        "";

    const user =
        data?.user ||
        data?.profile ||
        data?.data?.user ||
        data?.data?.profile ||
        null;

    return { token, user, raw: data };
}

export async function registerRequest(payload) {
    const { data } = await http.post(EP.register, payload);
    return data;
}

export async function loginRequest(payload) {
    const { data } = await http.post(EP.login, payload);
    return normalizeAuthResponse(data);
}