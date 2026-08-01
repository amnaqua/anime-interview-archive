import express from "express";

import { readJson, writeJson } from "../services/jsonStore.js";
import { slugify } from "../utils/slugify.js";

const router = express.Router();

const FILE = "docs/data/people.json";

router.get("/", async (req, res) => {
    const people = await readJson(FILE);

    const result =
        Object.entries(people)
            .map(([slug, person]) => ({
                slug,
                name: person.name
            }))
            .sort((a, b) =>
                a.name.localeCompare(b.name)
            );

    res.json(result);
});

router.post("/", async (req, res) => {
    const people = await readJson(FILE);

    const slug =
        req.body.slug ??
        slugify(req.body.name);

    if (people[slug]) {
        return res.status(409).json({
            error: "Person already exists"
        });
    }

    people[slug] = {
        name: req.body.name ?? "",
        aliases: req.body.aliases ?? [],
        roles: req.body.roles ?? []
    };

    await writeJson(
        FILE,
        people
    );

    res.json({
        slug,
        ...people[slug]
    });
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