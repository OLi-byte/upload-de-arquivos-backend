import express from "express";
import itemRouter from "./routes/itemRoutes.js";
import cors from "cors";
import path from "path";

const app = express();

const uploadDir = path.resolve("./uploads");

app.use("/uploads", express.static(uploadDir));

app.use(cors({ origin: "http://localhost:5173" }));

app.use(express.json());

app.use("/api/v1/items", itemRouter);

export default app;
