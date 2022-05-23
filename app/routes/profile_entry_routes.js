module.exports = app => {
    const profile_entries = require("../controllers/profile_entry.controller");

    var router = require("express").Router();

    router.post("/profile_entries/", profile_entries.create);
    router.get("/profile_entries/", profile_entries.findAll);
    router.get("profile_entries/:id", profile_entries.findOne);
    router.put("/profile_entries/:id", profile_entries.update);
    router.delete("/profile_entries/:id", profile_entries.delete);
    router.delete("/profile_entries/", profile_entries.deleteAll);

    app.use("/api", router);
}