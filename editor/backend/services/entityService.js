import {
    readJson,
    writeJson
} from "./jsonStore.js";

import entities from "../config/entities.js";

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
        item.slug ||
        item[config.slugField] ||
        item.name
            .toLowerCase()
            .replace(
                /[^a-z0-9]+/g,
                "-"
            )
            .replace(
                /(^-|-$)/g,
                ""
            );

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