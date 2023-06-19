import request from "supertest";
import express, { Request, Response, NextFunction } from "express";

import { internalServerError } from "./internal-server-error";

describe("internalServerError", () => {
  let app: express.Application;

  beforeEach(() => {
    app = express();
    app.use((req: Request, res: Response, next: NextFunction) => {
      throw new Error("Something broke!");
    });

    app.use(internalServerError);
  });

  it("should respond with a 500 status", async () => {
    const response = await request(app).get("/error").expect(500);

    expect(response.body.message).toBe("Internal Server Error");
  });
});
