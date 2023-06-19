import { NextFunction, Request, Response } from "express";
import logger from "../../logger";

// Middleware that handles not found errors
export function notFoundMiddleware(req: Request, res: Response, next: NextFunction) {
  const message = "Not Found";
  logger.warn(message);
  res.status(404).send({ message });
}
