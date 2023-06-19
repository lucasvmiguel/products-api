import request from "supertest";

import { PrismaClient } from "@prisma/client";

import app from "@/app";

const prisma = new PrismaClient();
const ENDPOINT = "/api/v1/products/";

describe(`[PUT] ${ENDPOINT}{id}`, () => {
  beforeEach(async () => {
    await prisma.product.deleteMany();
    await prisma.product.create({
      data: {
        name: "Product 1",
        stock_quantity: 10,
      },
    });
  });

  afterAll(async () => {
    await prisma.$disconnect();
  });

  it("should update a product", async () => {
    const product = await prisma.product.findFirst();
    const response = await request(app).put(`${ENDPOINT}${product?.id}`).send({
      name: "Product 1.1",
      stock_quantity: 20,
    });

    expect(response.status).toBe(200);
    expect(response.body).toMatchObject({
      data: {
        id: expect.any(Number),
        name: "Product 1.1",
        stock_quantity: 20,
        code: expect.any(String),
        created_at: expect.any(String),
        updated_at: expect.any(String),
      },
    });
  });

  it("should not update a product - invalid id", async () => {
    const response = await request(app).get(`${ENDPOINT}INVALID`);

    expect(response.status).toBe(400);
  });

  it("should not update a product - not found", async () => {
    const response = await request(app).get(`${ENDPOINT}999999999`);

    expect(response.status).toBe(404);
  });
});
