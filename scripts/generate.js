import fs from "fs/promises";
import path from "path";

import fg from "fast-glob";
import matter from "gray-matter";
import GithubSlugger from "github-slugger";

const slugger = new GithubSlugger();

import peopleData from "../docs/data/people.json" with { type: "json" };
import worksData from "../docs/data/works.json" with { type: "json" };
import companiesData from "../docs/data/companies.json" with { type: "json" };
import publishersData from "../docs/data/publishers.json" with { type: "json" };
import languagesData from "../docs/data/languages.json" with { type: "json" };
import mediaTypesData from "../docs/data/media-types.json" with { type: "json" };

import { lookup, resetDirectory, addToMap } from "./utils.js";
import { buildMarkdown } from "./markdown.js";
import { generateSidebar } from "./sidebar.js";
import { generateIndex } from "./index.js";
import { generateHome } from "./home.js";
import { generateSitemap } from "./sitemap.js";
import { generateRobots } from "./robots.js";

const ROOT = "docs";
const INTERVIEW_DIR = "interviews";

const PEOPLE_DIR = `${ROOT}/people`;
const WORKS_DIR = `${ROOT}/works`;
const COMPANIES_DIR = `${ROOT}/companies`;
const PUBLISHERS_DIR = `${ROOT}/publishers`;
const YEARS_DIR = `${ROOT}/years`;

const SIDEBAR_FILE = `${ROOT}/.vitepress/sidebar.ts`;

async function generateSection(directory, map, dictionary, title) {

    await resetDirectory(directory);

    await generateIndex(
        directory,
        title,
        dictionary
    );

    for (const [slug] of Object.entries(dictionary)) {

        const markdown = buildMarkdown({
            slug,
            entity: dictionary[slug],
            interviews: map.get(slug) ?? []
        });

        await fs.writeFile(
            path.join(directory, `${slug}.md`),
            markdown
        );
    }
}

function indexEntries(entries, map, field, interview) {

    for (const entry of entries ?? []) {

        const value = entry[field];

        if (!value) continue;

        if (Array.isArray(value)) {
            for (const slug of value) {
                addToMap(map, slug, interview);
            }
        } else {
            addToMap(map, value, interview);
        }
    }
}

async function main() {

    const people = new Map();
    const works = new Map();
    const companies = new Map();
    const publishers = new Map();
    const years = new Map();

    const files = await fg(`${INTERVIEW_DIR}/**/*.md`);

    const interviews = [];

    for (const file of files) {

        const raw = await fs.readFile(file, "utf8");
        const { data } = matter(raw);

        const entryDates = (data.entries ?? [])
            .filter(entry => entry.date)
            .map(entry =>
                entry.date instanceof Date
                    ? entry.date.toISOString().slice(0, 10)
                    : String(entry.date)
            )
            .sort();

        const interview = {
            title: data.title,

            date:
                data.date instanceof Date
                    ? data.date.toISOString().slice(0, 10)
                    : (data.date ?? entryDates[0] ?? "Unknown"),

            archived_at:
                data.archived_at instanceof Date
                    ? data.archived_at.toISOString().slice(0, 16).replace("T", " ")
                    : data.archived_at,

            links: (data.links ?? []).map(link => ({
                type: link.type,
                label: link.label,
                language: link.language
                    ? lookup(languagesData, link.language)
                    : null,
                url: link.url
            })),

            language: lookup(languagesData, data.language),

            people: data.people ?? [],

            peopleNames: (data.people ?? []).map(
                slug => lookup(peopleData, slug)
            ),

            anchor: slugger.slug(data.title),

            work: (data.work ?? []).map(
                slug => lookup(worksData, slug)
            ),

            companies: (data.companies ?? []).map(
                slug => lookup(companiesData, slug)
            ),

            publisher: (data.publisher ?? []).map(
                slug => lookup(publishersData, slug)
            ),

            entries: (data.entries ?? [])
                .map(entry => ({
                    title: entry.title,

                    date:
                        entry.date instanceof Date
                            ? entry.date.toISOString().slice(0, 10)
                            : String(entry.date),

                    publisher: lookup(
                        publishersData,
                        entry.publisher
                    ),

                    work: entry.work ?? [],

                    people: entry.people ?? []
                }))
                .sort((a, b) => a.date.localeCompare(b.date)),

            mediaType: lookup(mediaTypesData, data.media_type)
        };

        const year =
            interview.date === "Unknown"
                ? "unknown"
                : interview.date.slice(0, 4);

        interviews.push(interview);

        for (const slug of interview.people)
            addToMap(people, slug, interview);

        for (const slug of interview.work)
            addToMap(works, slug, interview);

        for (const slug of data.companies ?? [])
            addToMap(companies, slug, interview);

        for (const slug of data.publisher ?? [])
            addToMap(publishers, slug, interview);

        addToMap(years, year, interview);

        indexEntries(data.entries, people, "people", interview);
        indexEntries(data.entries, works, "work", interview);
        indexEntries(data.entries, publishers, "publisher", interview);
    }

    const yearsDictionary = {};

    for (const year of years.keys()) {
        yearsDictionary[year] = {
            name: year === "unknown" ? "Unknown" : year
        };
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
        COMPANIES_DIR,
        companies,
        companiesData,
        "Companies"
    );

    await generateSection(
        PUBLISHERS_DIR,
        publishers,
        publishersData,
        "Publishers"
    );

    await generateSection(
        YEARS_DIR,
        years,
        yearsDictionary,
        "Years"
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
                title: "Companies",
                base: "companies",
                dictionary: companiesData
            },
            {
                title: "Publishers",
                base: "publishers",
                dictionary: publishersData
            },
            {
                title: "Years",
                base: "years",
                dictionary: yearsDictionary
            }
        ]
    );

    const latestInterviews = interviews
        .filter(i => i.archived_at)
        .sort((a, b) => {
            return b.archived_at.localeCompare(a.archived_at);
        })
        .slice(0, 10);

    await generateHome({

        interviews: files.length,

        people: Object.keys(peopleData).length,

        works: Object.keys(worksData).length,

        companies: Object.keys(companiesData).length,

        publishers: Object.keys(publishersData).length,

        latestInterviews

    });

    await generateSitemap({
        people: peopleData,
        works: worksData,
        companies: companiesData,
        publishers: publishersData,
        years: yearsDictionary,

        peopleMap: people,
        worksMap: works,
        companiesMap: companies,
        publishersMap: publishers,
        yearsMap: years,

        interviews
    });

    await generateRobots();
}

main();