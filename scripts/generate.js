import fs from "fs/promises";
import path from "path";

import fg from "fast-glob";
import matter from "gray-matter";

import peopleData from "../docs/data/people.json" with { type: "json" };
import worksData from "../docs/data/works.json" with { type: "json" };
import studiosData from "../docs/data/studios.json" with { type: "json" };
import publishersData from "../docs/data/publishers.json" with { type: "json" };
import languagesData from "../docs/data/languages.json" with { type: "json" };

import { lookup, resetDirectory, addToMap } from "./utils.js";
import { buildMarkdown } from "./markdown.js";
import { generateSidebar } from "./sidebar.js";
import { generateIndex } from "./index.js";

const ROOT = "docs";
const INTERVIEW_DIR = "interviews";

const PEOPLE_DIR = `${ROOT}/people`;
const WORKS_DIR = `${ROOT}/works`;
const STUDIOS_DIR = `${ROOT}/studios`;
const PUBLISHERS_DIR = `${ROOT}/publishers`;

const SIDEBAR_FILE = `${ROOT}/.vitepress/sidebar.ts`;

async function generateSection(directory, map, dictionary, title) {

    await resetDirectory(directory);

    await generateIndex(
        directory,
        title,
        dictionary
    );

    for (const [slug] of Object.entries(dictionary)) {

        const markdown = buildMarkdown(
            lookup(dictionary, slug),
            map.get(slug) ?? []
        );

        await fs.writeFile(
            path.join(directory, `${slug}.md`),
            markdown
        );
    }
}

async function main() {

    const people = new Map();
    const works = new Map();
    const studios = new Map();
    const publishers = new Map();

    const files = await fg(`${INTERVIEW_DIR}/**/*.md`);

    for (const file of files) {

        const raw = await fs.readFile(file, "utf8");
        const { data } = matter(raw);

        const interview = {
            title: data.title,

            date:
                data.date instanceof Date
                    ? data.date.toISOString().slice(0, 10)
                    : data.date,

            url: data.url,

            language: lookup(languagesData, data.language),

            people: data.people ?? [],
            work: data.work ?? [],

            studio: (data.studio ?? []).map(
                slug => lookup(studiosData, slug)
            ),

            publisher: (data.publisher ?? []).map(
                slug => lookup(publishersData, slug)
            )
        };

        for (const slug of interview.people)
            addToMap(people, slug, interview);

        for (const slug of interview.work)
            addToMap(works, slug, interview);

        for (const slug of data.studio ?? [])
            addToMap(studios, slug, interview);

        for (const slug of data.publisher ?? [])
            addToMap(publishers, slug, interview);

    }

    await generateSection(
        PEOPLE_DIR,
        people,
        peopleData,
        "People"
    );

    await generateSection(
        WORKS_DIR,
        works,
        worksData,
        "Works"
    );

    await generateSection(
        STUDIOS_DIR,
        studios,
        studiosData,
        "Studios"
    );

    await generateSection(
        PUBLISHERS_DIR,
        publishers,
        publishersData,
        "Publishers"
    );

    await generateSidebar(
        SIDEBAR_FILE,
        [
            {
                title: "People",
                base: "people",
                dictionary: peopleData
            },
            {
                title: "Works",
                base: "works",
                dictionary: worksData
            },
            {
                title: "Studios",
                base: "studios",
                dictionary: studiosData
            },
            {
                title: "Publishers",
                base: "publishers",
                dictionary: publishersData
            }
        ]
    );

    console.log("Archive generated.");
}

main();