import pino from "pino";
import pretty from "pino-pretty";
const stream = pretty({
  levelFirst: true,
  colorize: true,
  ignore: "pid",
});
export const log = pino(stream);
