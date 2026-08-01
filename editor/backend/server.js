import express from "express";
import cors from "cors";

import entities from "./routes/entities.js";
import referenceRoutes from "./routes/reference.js";
import contentRoutes from "./routes/content.js";

const app = express();

app.use(cors());
app.use(express.json());

app.use("/api/reference", referenceRoutes);
app.use("/api/content", contentRoutes);
app.use("/api", entities);

app.listen(3001, () => {
    console.log("Server started on 3001");
});