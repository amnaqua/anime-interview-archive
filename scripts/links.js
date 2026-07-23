function makeLinks(base, slugs, names) {
    return slugs.map((slug, i) =>
        `[${names[i]}](/${base}/${slug})`
    );
}

export const peopleLinks = interview =>
    makeLinks("people", interview.people, interview.peopleNames);

export const workLinks = interview =>
    makeLinks("works", interview.work, interview.workNames);

export const companyLinks = interview =>
    makeLinks("companies", interview.companies, interview.companyNames);

export const publisherLinks = interview =>
    makeLinks("publishers", interview.publishers, interview.publisherNames);