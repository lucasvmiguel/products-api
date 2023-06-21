// Repository is the base class for all repositories
export abstract class Repository {}

// NotFoundError is a custom error class that we created to handle not found errors. We will use this class to handle all errors in our repository classes.
export class NotFoundError extends Error {
  constructor() {
    super("not found");
  }
}
