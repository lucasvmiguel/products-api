import type { NextFunction, Request, Response } from "express";

import logger from "../../logger";

export function loggerMiddleware(req: Request, res: Response, next: NextFunction) {
  logger.info(`${req.ip} [${req.method}] ${req.path} - ${res.statusCode}`);

  next();
}
