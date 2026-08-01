import express from "express";
import fs from "fs/promises";
import path from "path";

const router = express.Router();

const FILE =
    path.resolve(
        "../docs/data/people.json"
    );

console.log(FILE);

router.get("/", async (req, res) => {
    const people = JSON.parse(
        await fs.readFile(FILE, "utf8")
    );

    const result = Object.entries(people).map(
        ([slug, person]) => ({
            slug,
            ...person
        })
    );

    res.json(result);
});

router.get("/:slug", async (req, res) => {
    const people = JSON.parse(
        await fs.readFile(FILE, "utf8")
    );

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
    const people =
        JSON.parse(
            await fs.readFile(
                FILE,
                "utf8"
            )
        );

    const slug = req.params.slug;

    if (!people[slug]) {
        return res.status(404).json({
            error: "Person not found"
        });
    }

    const { slug: _, ...personData } = req.body;

    people[slug] = {
        ...people[slug],
        ...personData
    };

    let json = JSON.stringify(people, null, 2);

    json = json.replace(/},\n  "/g, "},\n\n  \"");

    await fs.writeFile(FILE, json);

    res.json({
        slug,
        ...people[slug]
    });
});

export default router;