import {
    readJson,
    writeJson
} from "./jsonStore.js";

import entities from "../config/entities.js";
import { slugify } from "../utils/slugify.js";

function getConfig(entity){
    const config =
        entities[entity];

    if (!config) {
        throw new Error(
            `Unknown entity: ${entity}`
        );
    }

    return config;
}

function makeSlug(item, config) {
    if (item.slug) {
        return slugify(item.slug);
    }

    if (config.slugField && item[config.slugField]) {
        return slugify(
            String(item[config.slugField])
        );
    }

    return slugify(item.name ?? "");
}

function makeWorkSlug(item, data) {
    const nameSlug =
        slugify(item.name ?? "");

    const typeSlug =
        slugify(item.type ?? "");

    if (!nameSlug) {
        throw new Error("Name is required");
    }

    if (!typeSlug) {
        throw new Error("Type is required");
    }

    const typeNorm =
        item.type
            .toLowerCase()
            .trim();

    const sameWork =
        Object.values(data)
            .some(
                work =>
                    slugify(work.name ?? "") === nameSlug &&
                    (work.type ?? "")
                        .toLowerCase()
                        .trim() === typeNorm
            );

    if (sameWork) {
        throw new Error(
            "Already exists"
        );
    }

    if (!data[nameSlug]) {
        return nameSlug;
    }

    const typedSlug =
        `${nameSlug}-${typeSlug}`;

    if (data[typedSlug]) {
        throw new Error(
            "Already exists"
        );
    }

    return typedSlug;
}

export async function list(entity){
    const config =
        getConfig(entity);

    const data =
        await readJson(
            config.file
        );

    return Object.entries(data)
        .map(
            ([slug, item]) => ({
                slug,
                ...item
            })
        );
}

export async function get(entity, slug){
    const config =
        getConfig(entity);

    const data =
        await readJson(
            config.file
        );

    const item =
        data[slug];

    if (!item) {
        return null;
    }

    return {
        slug,
        ...item
    };
}

export async function create(entity, item){
    const config =
        getConfig(entity);

    const data =
        await readJson(
            config.file
        );

    const slug =
        entity === "works"
            ? makeWorkSlug(item, data)
            : makeSlug(item, config);

    if (data[slug]) {
        throw new Error(
            "Already exists"
        );
    }

    data[slug] = {
        ...item
    };

    if (config.slugField) {
        delete data[slug][config.slugField];
    }

    delete data[slug].slug;
    delete data[slug].isNew;

    await writeJson(
        config.file,
        data
    );

    return {
        slug,
        ...data[slug]
    };
}

export async function update(entity, slug, item){
    const config =
        getConfig(entity);

    const data =
        await readJson(
            config.file
        );

    if (!data[slug]) {
        return null;
    }

    const {
        slug: _,
        isNew,
        ...clean
    } = item;

    data[slug] = {
        ...data[slug],
        ...clean
    };

    await writeJson(
        config.file,
        data
    );

    return {
        slug,
        ...data[slug]
    };
}