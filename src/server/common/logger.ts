import winston, { format, transports } from "winston";

const logLevels = {
  fatal: 0,
  error: 1,
  warn: 2,
  info: 3,
  debug: 4,
  trace: 5,
};

const logger = winston.createLogger({
  level: "debug",
  levels: logLevels,
  format: format.combine(format.timestamp(), format.json()),
  transports: [new transports.Console({ level: "info" })],
});

export default logger;
