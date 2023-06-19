import request from "supertest";
import express, { Request, Response, NextFunction } from "express";

import { notFound } from "./not-found";

describe("notFound", () => {
  let app: express.Application;

  beforeEach(() => {
    app = express();
    app.use(notFound);
  });

  it("should respond with a 404 status", async () => {
    const response = await request(app).get("/nonexistent-route").expect(404);

    expect(response.body.message).toBe("Not Found");
  });
});
