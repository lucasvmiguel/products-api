import request from "supertest";

import { PrismaClient } from "@prisma/client";

import app from "../../../app";

const prisma = new PrismaClient();
const ENDPOINT = "/api/v1/products";

describe(`[GET] ${ENDPOINT}`, () => {
  beforeEach(async () => {
    await prisma.product.deleteMany();
    await prisma.product.createMany({
      data: [
        {
          name: "Product 1",
          stock_quantity: 10,
        },
        {
          name: "Product 2",
          stock_quantity: 20,
        },
      ],
    });
  });

  afterAll(async () => {
    await prisma.$disconnect();
  });

  it("should return all products", async () => {
    const response = await request(app).get(ENDPOINT);

    expect(response.status).toBe(200);
    expect(response.body).toMatchObject({
      data: [
        {
          id: expect.any(Number),
          name: "Product 1",
          stock_quantity: 10,
          code: expect.any(String),
          created_at: expect.any(String),
          updated_at: expect.any(String),
        },
        {
          id: expect.any(Number),
          name: "Product 2",
          stock_quantity: 20,
          code: expect.any(String),
          created_at: expect.any(String),
          updated_at: expect.any(String),
        },
      ],
    });
  });
});
