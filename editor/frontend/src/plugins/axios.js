import axios from "axios";
import { useToast } from "../composable/useToast";

const API = "http://localhost:3001/api";

const instance =
    axios.create({
        baseURL: API
    });

const {
    show
} = useToast();

instance.interceptors.response.use(
    response => response,

    error => {
        const message =
            error.response?.data?.error
            ||
            error.message
            ||
            "Unknown error";

        show(
            message,
            "error"
        );

        return Promise.reject(error);
    }
);

export default instance;