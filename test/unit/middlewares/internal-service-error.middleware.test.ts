import request from "supertest";
import express, { Request, Response, NextFunction } from "express";

import { internalServerErrorMiddleware } from "@/middlewares/internal-service-error.middleware";

describe("internalServerErrorMiddleware", () => {
  let app: express.Application;

  beforeEach(() => {
    app = express();
    app.use((req: Request, res: Response, next: NextFunction) => {
      throw new Error("Something broke!");
    });

    app.use(internalServerErrorMiddleware);
  });

  it("should respond with a 500 status", async () => {
    const response = await request(app).get("/error").expect(500);

    expect(response.body.message).toBe("Internal Server Error");
  });
});
