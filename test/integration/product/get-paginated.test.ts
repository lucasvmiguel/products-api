import request from "supertest";

import { PrismaClient } from "@prisma/client";

import app from "@/app";

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
        {
          name: "Product 3",
          stock_quantity: 30,
        },
        {
          name: "Product 4",
          stock_quantity: 40,
        },
        {
          name: "Product 5",
          stock_quantity: 50,
        },
      ],
    });
  });

  afterAll(async () => {
    await prisma.$disconnect();
  });

  it("should return all products", async () => {
    let response = await request(app).get(`${ENDPOINT}?limit=2`);

    expect(response.status).toBe(200);
    expect(response.body).toMatchObject({
      data: {
        items: [
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
        next_cursor: expect.any(Number),
      },
    });

    response = await request(app).get(`${ENDPOINT}?limit=2&cursor=${response.body.data.next_cursor}`);

    expect(response.status).toBe(200);
    expect(response.body).toMatchObject({
      data: {
        items: [
          {
            id: expect.any(Number),
            name: "Product 3",
            stock_quantity: 30,
            code: expect.any(String),
            created_at: expect.any(String),
            updated_at: expect.any(String),
          },
          {
            id: expect.any(Number),
            name: "Product 4",
            stock_quantity: 40,
            code: expect.any(String),
            created_at: expect.any(String),
            updated_at: expect.any(String),
          },
        ],
        next_cursor: expect.any(Number),
      },
    });

    response = await request(app).get(`${ENDPOINT}?limit=2&cursor=${response.body.data.next_cursor}`);

    expect(response.status).toBe(200);
    expect(response.body).toMatchObject({
      data: {
        items: [
          {
            id: expect.any(Number),
            name: "Product 5",
            stock_quantity: 50,
            code: expect.any(String),
            created_at: expect.any(String),
            updated_at: expect.any(String),
          },
        ],
        next_cursor: expect.any(Number),
      },
    });

    response = await request(app).get(`${ENDPOINT}?limit=2&cursor=${response.body.data.next_cursor}`);

    expect(response.status).toBe(200);
    expect(response.body).toMatchObject({
      data: {
        items: [],
        next_cursor: null,
      },
    });
  });
});
