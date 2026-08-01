import fs from "fs/promises";

import fg from "fast-glob";
import matter from "gray-matter";

import peopleData from "../docs/data/people.json" with {type: "json"};
import worksData from "../docs/data/works.json" with {type: "json"};
import companiesData from "../docs/data/companies.json" with {type: "json"};
import publishersData from "../docs/data/publishers.json" with {type: "json"};

import {generateSidebar} from "./sidebar.js";
import {generateHome} from "./home.js";
import {generateSitemap} from "./sitemap.js";
import {generateRobots} from "./robots.js";

import {parseInterview} from "./parser.js";
import {indexRecord} from "./indexer.js";
import {generateSection} from "./sections.js";
import {createSections} from "./sections-config.js";
import { validateInterview } from "./validator.js";

const ROOT = "docs";
const INTERVIEW_DIR = "interviews";

const SIDEBAR_FILE = `${ROOT}/.vitepress/sidebar.ts`;

function getLatestRecords(records) {
    return records
        .filter(record => record.archived_at)
        .sort(
            (a, b) =>
                new Date(b.archived_at) -
                new Date(a.archived_at)
        )
        .slice(0, 10);
}

function getStats(sections) {
    return Object.fromEntries(
        sections
            .filter(
                section =>
                    section.base !== "years"
            )
            .map(
                section => [
                    section.base,
                    Object.keys(
                        section.dictionary
                    ).length
                ]
            )
    );
}

async function main() {
    const maps = {
        interviews: {
            people: new Map(),
            works: new Map(),
            companies: new Map(),
            publishers: new Map(),
            years: new Map()
        },

        articles: {
            people: new Map(),
            works: new Map(),
            companies: new Map(),
            publishers: new Map(),
            years: new Map()
        },

        productionMaterials: {
            people: new Map(),
            works: new Map(),
            companies: new Map(),
            publishers: new Map(),
            years: new Map()
        },

        artworks: {
            people: new Map(),
            works: new Map(),
            companies: new Map(),
            publishers: new Map(),
            years: new Map()
        }
    };

    const files = await fg(
        `${INTERVIEW_DIR}/**/*.md`
    );

    const records = {
        interview: [],
        article: [],
        production_material: [],
        artwork: []
    };

    for (const file of files) {
        const raw = await fs.readFile(
            file,
            "utf8"
        );

        const {data} = matter(raw);

        validateInterview(
            data,
            file
        );

        const interview =
            parseInterview(data);

        if (!records[interview.type]) {
            records[interview.type] = [];
        }

        records[interview.type].push(interview);

        const target =
            interview.type === "article"
                ? maps.articles
                : interview.type === "production_material"
                    ? maps.productionMaterials
                    : interview.type === "artwork"
                        ? maps.artworks
                        : maps.interviews;

        indexRecord({
            interview,
            data,
            ...target
        });
    }

    const yearsDictionary =
        Object.fromEntries(
            [...maps.interviews.years.keys()]
                .map(year => [
                    year,
                    {
                        name:
                            year === "unknown"
                                ? "Unknown"
                                : year
                    }
                ])
        );

    const sections = createSections({
        maps,
        yearsDictionary
    });

    await Promise.all(
        sections.map(
            generateSection
        )
    );

    await generateSidebar(
        SIDEBAR_FILE,
        sections.map(
            ({
                 title,
                 base,
                 dictionary
             }) => ({
                title,
                base,
                dictionary
            })
        )
    );

    const latestRecords = [
        ...records.interview,
        ...records.article,
        ...records.production_material,
        ...records.artwork
    ];

    await generateHome({
        interviews: records.interview.length,
        articles: records.article.length,
        productionMaterials: records.production_material.length,
        artworks: records.artwork.length,

        latestRecords:
            getLatestRecords(latestRecords),

        ...getStats(sections)
    });

    await generateSitemap({
        people: peopleData,
        works: worksData,
        companies: companiesData,
        publishers: publishersData,
        years: yearsDictionary,

        peopleMap: maps.interviews.people,
        worksMap: maps.interviews.works,
        companiesMap: maps.interviews.companies,
        publishersMap: maps.interviews.publishers,
        yearsMap: maps.interviews.years,

        interviews: records.interview
    });

    await generateRobots();
}

main();