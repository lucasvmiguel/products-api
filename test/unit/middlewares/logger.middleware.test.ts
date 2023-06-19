import request from "supertest";
import express from "express";

import { loggerMiddleware } from "@/middlewares/logger.middleware";

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
