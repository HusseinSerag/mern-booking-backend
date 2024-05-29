import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import path from "path";
import { log } from "./utils/logger";
import { connect } from "./utils/connect";
import { routes } from "./routes";
dotenv.config({ path: path.resolve(__dirname, "../config.env") });

const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors());

app.get("/api/test", async (req, res) => {
  res.sendStatus(200);
});

app.listen(8000, async () => {
  log.info("Server started at port 8000");
  await connect();
  routes(app);
});
