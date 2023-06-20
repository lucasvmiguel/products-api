import { ApolloError } from "apollo-server-express";
import { Logger } from "winston";

import logger from "@/utils/logger.util";

// Resolver is the base class for all resolvers
export abstract class Resolver {
  public logger: Logger;

  constructor() {
    this.logger = logger;
  }

  // resolveNotFound is used to resolve not found error
  resolveNotFound(error: Error) {
    this.logger.error(error);

    throw new ApolloError("not found", "NOT_FOUND");
  }

  // resolveInternalServerError is used to resolve internal server error
  resolveInternalServerError(error: Error) {
    this.logger.error(error);

    throw new ApolloError("internal server error", "INTERNAL_SERVER_ERROR");
  }
}
