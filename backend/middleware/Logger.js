import pino from "pino";
import pinoHttp from "pino-http";

const pretty = {
  colorize: true,
  translateTime: "yyyy-mm-dd HH:MM:ss",
  ignore: "pid,hostname",
  levelFirst: true,
};

export const logger = pino({
  transport: {
    target: "pino-pretty",
    options: pretty,
  },
  level: process.env.NODE_ENV === "production" ? "info" : "debug",
});

export default pinoHttp({ logger });
