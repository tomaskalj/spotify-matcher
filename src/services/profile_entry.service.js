import http from "../http-common";

class ProfileEntryService {
    getAll() {
        return http.get("/profile_entries");
    }

    create(data) {
        return http.post("/profile_entries", data);
    }

    update(id, data) {
        return http.put(`/profile_entries/${id}`, data);
    }

    getByToken(token) {
        return http.get(`/profile_entries?token=${token}`);
    }
}

export default new ProfileEntryService();