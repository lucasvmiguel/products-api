import request from "supertest";

import { PrismaClient } from "@prisma/client";

import app from "../../../src/app";

const prisma = new PrismaClient();
const ENDPOINT = "/api/v1/products";

describe(`[POST] ${ENDPOINT}`, () => {
  beforeEach(async () => {
    await prisma.product.deleteMany();
  });

  afterAll(async () => {
    await prisma.$disconnect();
  });

  it("should create a new product", async () => {
    const response = await request(app).post(ENDPOINT).send({
      name: "Product 1",
      stock_quantity: 10,
    });

    expect(response.status).toBe(201);
    expect(response.body).toMatchObject({
      data: {
        id: expect.any(Number),
        name: "Product 1",
        stock_quantity: 10,
        code: expect.any(String),
        created_at: expect.any(String),
        updated_at: expect.any(String),
      },
    });
  });

  it("should return 400 - invalid stock quantity", async () => {
    const response = await request(app).post(ENDPOINT).send({
      name: "Product 1",
    });

    expect(response.status).toBe(400);
  });
});
