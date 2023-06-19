import request from "supertest";
import express from "express";

import { notFoundMiddleware } from "@/middlewares/not-found.middleware";

describe("notFoundMiddleware", () => {
  let app: express.Application;

  beforeEach(() => {
    app = express();
    app.use(notFoundMiddleware);
  });

  it("should respond with a 404 status", async () => {
    const response = await request(app).get("/nonexistent-route").expect(404);

    expect(response.body.message).toBe("Not Found");
  });
});
