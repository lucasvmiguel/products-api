import type { Response } from "express";
import type { Logger } from "winston";
import * as yup from "yup";

import logger from "../../utils/logger";

export type StructuredResponse<T> = Response<{ message: string; data?: T; errors?: string[] }>;

export class Controller {
  public logger: Logger;

  constructor() {
    this.logger = logger;
  }

  respondBadRequest<T>(res: StructuredResponse<T>, error: yup.ValidationError) {
    this.logger.error(error);
    res.status(400).json({ message: "invalid request parameters", errors: error?.errors || [] });
  }

  respondNotFound<T>(res: StructuredResponse<T>, error: Error) {
    this.logger.error(error);
    res.status(404).json({ message: "not found" });
  }

  respondInternalServerError<T>(res: StructuredResponse<T>, error: Error) {
    this.logger.error(error);
    res.status(500).json({ message: "internal server error" });
  }

  respondCreatedResponse<T>(res: StructuredResponse<T>, data: T) {
    res.status(201).json({ message: "created", data });
  }

  respondOkResponse<T>(res: StructuredResponse<T>, data: T) {
    res.status(200).json({ message: "success", data });
  }

  respondNoContentResponse<T>(res: StructuredResponse<T>, data: T) {
    res.status(204).json({ message: "deleted", data });
  }
}
