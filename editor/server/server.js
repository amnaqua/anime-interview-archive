import express from "express";
import cors from "cors";

import peopleRouter from "../backend/routes/people.js";

const app = express();

app.use(cors());
app.use(express.json());

app.use("/api/people", peopleRouter);

app.listen(3001, () => {
    console.log("Server started on 3001");
});