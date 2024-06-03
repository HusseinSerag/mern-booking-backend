import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import path from "path";
import { log } from "./utils/logger";
import { connect } from "./utils/connect";
import { routes } from "./routes";
import cookieParser from "cookie-parser";
import helmet from "helmet";
import ExpressMongoSanitize from "express-mongo-sanitize";
if (process.env.NODE_ENV === "testing") {
  dotenv.config({ path: path.resolve(__dirname, "../e2e.env") });
} else {
  dotenv.config({ path: path.resolve(__dirname, "../config.env") });
}

log.info(process.env.FRONTEND_URL);
export const app = express();
app.use(helmet());
app.use(
  cors({
    origin: process.env.FRONTEND_URL,
    credentials: true,
  })
);
app.use(
  express.json({
    limit: "10kb",
  })
);
app.use(express.urlencoded({ extended: true }));
app.use(ExpressMongoSanitize());

app.use(cookieParser());

app.get("/api/test", async (req, res) => {
  res.sendStatus(200);
});

app.listen(8000, async () => {
  log.info("Server started at port 8000");
  log.info(process.env.FRONTEND_URL);
  await connect();
  routes(app);
});
