import { config } from "dotenv";
import App from "./app";
import { PORT } from "./env";
import { logger } from "./utils/logger/logger";
try {
  const result: any = config();
  if (result && result.parsed) {
    Object.keys(result.parsed).forEach((key) => {

      process.env[key] = result.parsed[key];
    });
  }
} catch (e) {
//   console.info(".env file not found, skipping..");
    logger.log("info", ".env file not found, skipping..");
}
new App(Number(PORT)).listen();
