module.exports = app => {
    const profile_entries = require("../controllers/profile_entry.controller.js");

    let router = require("express").Router();

    router.post("/", profile_entries.create);
    router.get("/", profile_entries.findAll);
    router.get("/:id", profile_entries.findOne);
    router.put("/:id", profile_entries.update);
    router.delete("/:id", profile_entries.delete);
    router.delete("/", profile_entries.deleteAll);

    app.use("/api/profile_entries", router);
}