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

    getByUserId(userId) {
        return http.get(`/profile_entries?user_id=${userId}`)
    }
}

export default new ProfileEntryService();