import axios from "axios";

const API =
    "http://localhost:3001/api";

export function getPeople(){
    return axios
        .get(`${API}/people`)
        .then(r => r.data);

}

export async function getPerson(slug) {
    const response =
        await axios.get(
            `${API}/people/${slug}`
        );

    return response.data;
}

export function updatePerson(
    slug,
    data
){

    return axios
        .put(
            `${API}/people/${slug}`,
            data
        )
        .then(r => r.data);
}