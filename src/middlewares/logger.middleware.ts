import type { NextFunction, Request, Response } from "express";

import logger from "@/utils/logger.util";

export function loggerMiddleware(req: Request, res: Response, next: NextFunction) {
  res.on("finish", function () {
    logger.info(`[${req.ip}] [${req.method}]${req.path} - ${res.statusCode}`);
  });
  next();
}
