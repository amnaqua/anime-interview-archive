import peopleData from "../docs/data/people.json" with { type: "json" };
import worksData from "../docs/data/works.json" with { type: "json" };
import companiesData from "../docs/data/companies.json" with { type: "json" };
import publishersData from "../docs/data/publishers.json" with { type: "json" };
import languagesData from "../docs/data/languages.json" with { type: "json" };
import mediaTypesData from "../docs/data/media-types.json" with { type: "json" };


function validateArraySlugs(
    values,
    dictionary,
    field,
    file
) {
    for (const slug of values ?? []) {

        if (!dictionary[slug]) {
            throw new Error(
                `${file}: Unknown ${field} "${slug}"`
            );
        }
    }
}


export function validateInterview(
    data,
    file
) {

    if (!data.title) {
        throw new Error(
            `${file}: Missing title`
        );
    }


    validateArraySlugs(
        data.people,
        peopleData,
        "person",
        file
    );


    validateArraySlugs(
        data.work,
        worksData,
        "work",
        file
    );


    validateArraySlugs(
        data.companies,
        companiesData,
        "company",
        file
    );


    validateArraySlugs(
        data.publisher,
        publishersData,
        "publisher",
        file
    );


    if (
        data.language &&
        !languagesData[data.language]
    ) {
        throw new Error(
            `${file}: Unknown language "${data.language}"`
        );
    }


    if (
        data.media_type &&
        !mediaTypesData[data.media_type]
    ) {
        throw new Error(
            `${file}: Unknown media_type "${data.media_type}"`
        );
    }


    for (const entry of data.entries ?? []) {

        validateArraySlugs(
            entry.people,
            peopleData,
            "entry person",
            file
        );


        validateArraySlugs(
            entry.work,
            worksData,
            "entry work",
            file
        );


        if (
            entry.publisher &&
            !publishersData[entry.publisher]
        ) {
            throw new Error(
                `${file}: Unknown entry publisher "${entry.publisher}"`
            );
        }
    }
}