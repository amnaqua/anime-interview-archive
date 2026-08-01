import express from "express";

import { list } from "../services/entityService.js";

const router = express.Router();

router.get("/", async (req, res) => {
    res.json({
        people: await list("people"),
        works: await list("works"),
        companies: await list("companies"),
        publishers: await list("publishers"),
        languages: await list("languages"),
        mediaTypes: await list("media-types")
    });
});

export default router;