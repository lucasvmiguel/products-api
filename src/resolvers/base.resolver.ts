import { ApolloError } from "apollo-server-express";
import { Logger } from "winston";

import logger from "@/utils/logger.util";

// Resolver is the base class for all resolvers
export abstract class Resolver {
  public logger: Logger;

  constructor() {
    this.logger = logger;
  }

  // respondBadRequest is used to respond bad request error
  resolveBadRequest(error: Error) {
    this.logger.error(error);

    throw new BadRequestError();
  }

  // resolveNotFound is used to resolve not found error
  resolveNotFound(error: Error) {
    this.logger.error(error);

    throw new NotFoundError();
  }

  // resolveInternalServerError is used to resolve internal server error
  resolveInternalServerError(error: Error) {
    this.logger.error(error);

    throw new InternalServerError();
  }
}

// NotFoundError is used to respond not found error
export class NotFoundError extends ApolloError {
  constructor() {
    super("not found", "NOT_FOUND");
  }
}

// BadRequestError is used to respond bad request error
export class BadRequestError extends ApolloError {
  constructor() {
    super("bad request", "BAD_REQUEST");
  }
}

// InternalServerError is used to respond internal server error
export class InternalServerError extends ApolloError {
  constructor() {
    super("internal server error", "INTERNAL_SERVER_ERROR");
  }
}
