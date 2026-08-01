export default {
    title: "People",

    endpoint: "people",

    newItem: {
        name: "",
        aliases: [],
        roles: []
    },

    fields: [
        {
            name: "name",
            label: "Name",
            type: "text"
        },
        {
            name: "aliases",
            label: "Aliases",
            type: "list"
        },
        {
            name: "roles",
            label: "Roles",
            type: "list"
        }
    ]
}