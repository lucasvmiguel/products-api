import type { Response } from "express";
import type { Logger } from "winston";
import * as yup from "yup";

import logger from "@/utils/logger.util";

// StructuredResponse is the response type for all controllers
export type StructuredResponse<T> = Response<{ message: string; data?: T; errors?: string[] }>;

// Controller is the base class for all controllers
export abstract class Controller {
  public logger: Logger;

  constructor() {
    this.logger = logger;
  }

  // respondBadRequest is used to respond with bad request error
  respondBadRequest<T>(res: StructuredResponse<T>, error: yup.ValidationError) {
    this.logger.error(error);
    res.status(400).json({ message: "invalid request parameters", errors: error?.errors || [] });
  }

  // respondNotFound is used to respond with not found error
  respondNotFound<T>(res: StructuredResponse<T>, error: Error) {
    this.logger.error(error);
    res.status(404).json({ message: "not found" });
  }

  // respondInternalServerError is used to respond with internal server error
  respondInternalServerError<T>(res: StructuredResponse<T>, error: Error) {
    this.logger.error(error);
    res.status(500).json({ message: "internal server error" });
  }

  // respondCreatedResponse is used to respond with created response
  respondCreatedResponse<T>(res: StructuredResponse<T>, data: T) {
    res.status(201).json({ message: "created", data });
  }

  // respondOkResponse is used to respond with ok response
  respondOkResponse<T>(res: StructuredResponse<T>, data: T) {
    res.status(200).json({ message: "success", data });
  }

  // respondNoContentResponse is used to respond with no content response
  respondNoContentResponse<T>(res: StructuredResponse<T>) {
    res.status(204).send();
  }
}
