import { createLogger, format, transports } from "winston";
import { MONGO_DB_CONNECTION_STRING } from "../../env";
import { MongoDB } from "winston-mongodb";

export const logger = createLogger({
  format: format.combine(
    format.timestamp(),
    format.prettyPrint()
  ),

  transports: [
    new transports.File({
      filename: "info.log",
    }),
    new transports.Console({
      level: "info",
    }),
    new MongoDB({
      level: "error",
      options: { useUnifiedTopology: true },
      db: MONGO_DB_CONNECTION_STRING,
      collection: "error-file",
    }),
  ],
});
