import "module-alias/register";

import dotenv from "dotenv";
dotenv.config();

import logger from "@/utils/logger.util";
import config from "@/config";
import app from "@/app";

logger.info(`server starting...`);

// Start server
app.listen(config.APP_PORT, () => {
  logger.info(`🚀 ${config.APP_NAME} 🚀`);
  logger.info(`🚀 Listening on ${config.APP_PORT} with NODE_ENV=${config.NODE_ENV} 🚀`);
});
