import { NextFunction, Request, Response } from "express";
import logger from "../logger";

// Middleware that handles internal server errors
export function internalServerError(err: Error, req: Request, res: Response, next: NextFunction) {
  const message = "Internal Server Error";
  logger.error(err.stack);
  res.status(500).send({ message });
}
