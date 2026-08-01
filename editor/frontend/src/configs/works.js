export default {
    title: "Works",

    endpoint: "works",

    newItem: {
        name: "",
        type: "",
        year: null
    },

    fields: [
        {
            name: "name",
            label: "Name",
            type: "text"
        },
        {
            name: "type",
            label: "Type",
            type: "text"
        },
        {
            name: "year",
            label: "Year",
            type: "number"
        }
    ]
}