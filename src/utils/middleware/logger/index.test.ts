import request from "supertest";
import express, { Request, Response, NextFunction } from "express";

import { loggerMiddleware } from ".";

describe("loggerMiddleware", () => {
  let app: express.Application;

  beforeEach(() => {
    app = express();

    app.use(loggerMiddleware);
  });

  it("should pass to next handler", async () => {
    const response = await request(app).get("/whatever").expect(404);

    expect(response.body.message).toBe(undefined);
  });
});
