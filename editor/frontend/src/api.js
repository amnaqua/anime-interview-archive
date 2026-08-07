import axios from "./plugins/axios";

export function getEntities(endpoint) {
    return axios
        .get(`/${endpoint}`)
        .then(r => r.data);
}

export function getEntity(endpoint, slug) {
    return axios
        .get(
            `/${endpoint}/${slug}`
        )
        .then(r => r.data);
}

export function createEntity(endpoint, data) {
    return axios
        .post(
            `/${endpoint}`,
            data
        )
        .then(r => r.data);
}

export function updateEntity(endpoint, slug, data) {
    return axios
        .put(
            `/${endpoint}/${slug}`,
            data
        )
        .then(r => r.data);
}

export function getReferenceData() {
    return axios
        .get("/reference")
        .then(r => r.data);
}

export function generateContent(data) {
    return axios
        .post(
            "/content/generate",
            data
        )
        .then(r => r.data);
}