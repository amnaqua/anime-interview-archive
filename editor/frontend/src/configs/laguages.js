export default {
    title: "Languages",

    endpoint: "languages",

    slugField: "iso",

    newItem: {
        iso: "",
        name: ""
    },

    fields: [
        {
            name: "iso",
            label: "ISO Code",
            type: "text"
        },
        {
            name: "name",
            label: "Name",
            type: "text"
        }
    ]
}