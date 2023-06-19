import request from "supertest";

import { PrismaClient } from "@prisma/client";

import app from "@/app";

const prisma = new PrismaClient();
const ENDPOINT = "/api/v1/products/";

describe(`[DELETE] ${ENDPOINT}{id}`, () => {
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

  it("should delete a product and return", async () => {
    const product = await prisma.product.findFirst();
    const response = await request(app).delete(`${ENDPOINT}${product?.id}`);

    expect(response.status).toBe(204);
  });

  it("should not delete a product - invalid id", async () => {
    const response = await request(app).delete(`${ENDPOINT}INVALID`);

    expect(response.status).toBe(400);
  });

  it("should not delete a product - not found", async () => {
    const response = await request(app).delete(`${ENDPOINT}999999999`);

    expect(response.status).toBe(404);
  });
});
