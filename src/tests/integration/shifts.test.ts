import request from "supertest";
import app from "../../app";

import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

describe("GET /shifts", () => {
  afterAll(async () => {
    await prisma.$disconnect();
  });

  it("should return some shifts", async () => {
    const response = await request(app).get("/shifts?worker_id=1");

    expect(response.status).toBe(200);
    expect(Array.isArray(response.body)).not.toBe({});
  });

  it("should return no shifts - invalid worker", async () => {
    const response = await request(app).get("/shifts?worker_id=99");

    expect(response.status).toBe(400);
  });

  it("should return no shifts - invalid worker_id param", async () => {
    const response = await request(app).get("/shifts?worker_id=invalid");

    expect(response.status).toBe(400);
  });
});
