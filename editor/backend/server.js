import express from "express";
import cors from "cors";

import entities from "./routes/entities.js";

const app = express();

app.use(cors());
app.use(express.json());

app.use(
    "/api",
    entities
);

app.listen(3001, () => {
    console.log("Server started on 3001");
});