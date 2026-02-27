export const storage = {
    getUserToken() {
        return localStorage.getItem("userToken") || "";
    },
    setUserToken(t) {
        localStorage.setItem("userToken", t);
    },
    clearUserToken() {
        localStorage.removeItem("userToken");
    },

    getAdminToken() {
        return localStorage.getItem("adminToken") || "";
    },
    setAdminToken(t) {
        localStorage.setItem("adminToken", t);
    },
    clearAdminToken() {
        localStorage.removeItem("adminToken");
    },
};