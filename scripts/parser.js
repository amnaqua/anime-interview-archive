import GithubSlugger from "github-slugger";

import peopleData from "../docs/data/people.json" with { type: "json" };
import worksData from "../docs/data/works.json" with { type: "json" };
import companiesData from "../docs/data/companies.json" with { type: "json" };
import publishersData from "../docs/data/publishers.json" with { type: "json" };
import languagesData from "../docs/data/languages.json" with { type: "json" };
import mediaTypesData from "../docs/data/media-types.json" with { type: "json" };

import { lookup } from "./utils.js";

const slugger = new GithubSlugger();

export function parseInterview(data) {

    const entryDates = (data.entries ?? [])
        .filter(entry => entry.date)
        .map(entry =>
            entry.date instanceof Date
                ? entry.date.toISOString().slice(0, 10)
                : String(entry.date)
        )
        .sort();

    return {

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

        language: data.language
            ? lookup(languagesData, data.language)
            : null,

        people: data.people ?? [],
        peopleNames: (data.people ?? []).map(
            slug => lookup(peopleData, slug)
        ),

        anchor: slugger.slug(data.title),

        work: data.work ?? [],
        workNames: (data.work ?? []).map(
            slug => lookup(worksData, slug)
        ),

        companies: data.companies ?? [],
        companyNames: (data.companies ?? []).map(
            slug => lookup(companiesData, slug)
        ),

        publishers: data.publisher ?? [],
        publisherNames: (data.publisher ?? []).map(
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

        mediaType: data.media_type
            ? lookup(mediaTypesData, data.media_type)
            : null
    };
}