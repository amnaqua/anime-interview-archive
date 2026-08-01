import express from "express";

import {
    readJson,
    writeJson
} from "../services/jsonStore.js";

const router = express.Router();

const FILE = "../docs/data/people.json";

router.get("/", async (req, res) => {
    const people = await readJson(FILE);

    const result =
        Object.entries(people)
            .map(
                ([slug, person]) => ({
                    slug,
                    ...person
                })
            );

    res.json(result);
});

router.get("/:slug", async (req, res) => {
    const people = await readJson(FILE);
    const person = people[req.params.slug];

    if (!person) {
        return res.status(404).json({
            error: "Person not found"
        });
    }

    res.json({
        slug: req.params.slug,
        ...person
    });
});

router.put("/:slug", async (req, res) => {
    const people = await readJson(FILE);
    const slug = req.params.slug;

    if (!people[slug]) {
        return res.status(404).json({
            error: "Person not found"
        });
    }

    const {
        slug: _,
        ...personData
    } = req.body;

    people[slug] = {
        ...people[slug],
        ...personData
    };

    await writeJson(FILE, people);

    res.json({
        slug,
        ...people[slug]
    });
});

export default router;