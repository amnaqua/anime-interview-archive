import peopleData from "../docs/data/people.json" with { type: "json" };
import worksData from "../docs/data/works.json" with { type: "json" };
import companiesData from "../docs/data/companies.json" with { type: "json" };
import publishersData from "../docs/data/publishers.json" with { type: "json" };


const ROOT = "docs";


export function createSections({
                                   maps,
                                   yearsDictionary
                               }) {

    return [
        {
            title: "People",
            base: "people",
            directory: `${ROOT}/people`,
            dictionary: peopleData,

            interviews: maps.interviews.people,
            articles: maps.articles.people,
            productionMaterials: maps.productionMaterials.people
        },

        {
            title: "Works",
            base: "works",
            directory: `${ROOT}/works`,
            dictionary: worksData,

            interviews: maps.interviews.works,
            articles: maps.articles.works,
            productionMaterials: maps.productionMaterials.works
        },

        {
            title: "Companies",
            base: "companies",
            directory: `${ROOT}/companies`,
            dictionary: companiesData,

            interviews: maps.interviews.companies,
            articles: maps.articles.companies,
            productionMaterials: maps.productionMaterials.companies
        },

        {
            title: "Publishers",
            base: "publishers",
            directory: `${ROOT}/publishers`,
            dictionary: publishersData,

            interviews: maps.interviews.publishers,
            articles: maps.articles.publishers,
            productionMaterials: maps.productionMaterials.publishers
        },

        {
            title: "Years",
            base: "years",
            directory: `${ROOT}/years`,
            dictionary: yearsDictionary,

            interviews: maps.interviews.years,
            articles: maps.articles.years,
            productionMaterials: maps.productionMaterials.years
        }
    ];
}