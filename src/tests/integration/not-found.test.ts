import request from "supertest";
import app from "../../app";

import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

describe("GET /not-found", () => {
  afterAll(async () => {
    await prisma.$disconnect();
  });

  it("should return 404", async () => {
    const response = await request(app).get("/not-found");

    expect(response.status).toBe(404);
  });
});
