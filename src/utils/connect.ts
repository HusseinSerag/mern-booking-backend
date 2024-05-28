import mongoose from "mongoose";
import { log } from "./logger";

export function connect() {
  const dbUri = process.env.MONGODB_CONNECTION_STRING!;

  return mongoose
    .connect(dbUri)
    .then(() => {
      log.info("Database connected successfully");
    })
    .catch((e) => {
      log.fatal(e);
      log.error("Crashing server....");
      process.exit(1);
    });
}
