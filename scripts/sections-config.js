import peopleData from "../docs/data/people.json" with { type: "json" };
import worksData from "../docs/data/works.json" with { type: "json" };
import companiesData from "../docs/data/companies.json" with { type: "json" };
import publishersData from "../docs/data/publishers.json" with { type: "json" };


const ROOT = "docs";


export function createSections({
                                   people,
                                   works,
                                   companies,
                                   publishers,
                                   years,
                                   yearsDictionary
                               }) {

    return [
        {
            title: "People",
            base: "people",
            directory: `${ROOT}/people`,
            dictionary: peopleData,
            map: people
        },

        {
            title: "Works",
            base: "works",
            directory: `${ROOT}/works`,
            dictionary: worksData,
            map: works
        },

        {
            title: "Companies",
            base: "companies",
            directory: `${ROOT}/companies`,
            dictionary: companiesData,
            map: companies
        },

        {
            title: "Publishers",
            base: "publishers",
            directory: `${ROOT}/publishers`,
            dictionary: publishersData,
            map: publishers
        },

        {
            title: "Years",
            base: "years",
            directory: `${ROOT}/years`,
            dictionary: yearsDictionary,
            map: years
        }
    ];
}