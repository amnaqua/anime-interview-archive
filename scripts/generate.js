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
import {indexInterview} from "./indexer.js";
import {generateSection} from "./sections.js";
import {createSections} from "./sections-config.js";
import { validateInterview } from "./validator.js";

const ROOT = "docs";
const INTERVIEW_DIR = "interviews";

const SIDEBAR_FILE = `${ROOT}/.vitepress/sidebar.ts`;

function getLatestInterviews(interviews) {
    return interviews
        .filter(i => i.archived_at)
        .sort(
            (a, b) =>
                b.archived_at.localeCompare(
                    a.archived_at
                )
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
    const people = new Map();
    const works = new Map();
    const companies = new Map();
    const publishers = new Map();
    const years = new Map();

    const files = await fg(
        `${INTERVIEW_DIR}/**/*.md`
    );

    const interviews = [];

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

        interviews.push(interview);

        indexInterview({
            interview,
            data,
            people,
            works,
            companies,
            publishers,
            years
        });
    }

    const yearsDictionary =
        Object.fromEntries(
            [...years.keys()]
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
        people,
        works,
        companies,
        publishers,
        years,
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

    await generateHome({
        interviews: interviews.length,

        latestInterviews:
            getLatestInterviews(
                interviews
            ),

        ...getStats(
            sections
        )
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