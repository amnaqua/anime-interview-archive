import axios from "axios";

const API = "http://localhost:3001/api";

export function getEntities(endpoint) {
    return axios
        .get(
            `${API}/${endpoint}`
        )
        .then(r => r.data);
}

export function getEntity(endpoint, slug) {
    return axios
        .get(
            `${API}/${endpoint}/${slug}`
        )
        .then(r => r.data);
}

export function createEntity(endpoint, data) {
    return axios
        .post(
            `${API}/${endpoint}`,
            data
        )
        .then(r => r.data);
}

export function updateEntity(endpoint, slug, data) {
    return axios
        .put(
            `${API}/${endpoint}/${slug}`,
            data
        )
        .then(r => r.data);
}

export function getReferenceData() {
    return axios
        .get(`${API}/reference`)
        .then(r => r.data);
}

export function generateContent(data) {
    return axios
        .post(`${API}/content/generate`, data)
        .then(r => r.data);
}