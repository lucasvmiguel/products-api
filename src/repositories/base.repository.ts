// NotFoundError is a custom error class that we created to handle not found errors. We will use this class to handle all errors in our repository classes.
export class NotFoundError extends Error {
  constructor(message?: string) {
    super(message);
  }
}

// Repository is the base class for all repositories
export abstract class Repository {}
