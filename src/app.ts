import express from "express";
import cors from "cors";

import dotenv from "dotenv";
import mongoose from "mongoose";
import path from "path";
import { log } from "./utils/logger";

dotenv.config({ path: path.resolve(__dirname, "../config.env") });
mongoose.connect(process.env.MONGODB_CONNECTION_STRING as string).then(() => {
  console.log("CONNECTED");
});
const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors());

app.get("/api/test", async (req, res) => {
  res.sendStatus(200);
});

app.listen(8000, () => {
  log.info("started");
});
