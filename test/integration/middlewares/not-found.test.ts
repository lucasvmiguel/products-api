import request from "supertest";

import { PrismaClient } from "@prisma/client";

import app from "@/app";

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
