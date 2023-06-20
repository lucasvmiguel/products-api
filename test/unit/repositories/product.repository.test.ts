import type { PrismaClient } from "@prisma/client";

import { ProductRepository } from "@/repositories/product.repository";
import { productFactory } from "../factories/product.factory";

describe("ProductRepository", () => {
  const e = new Error("error");
  const limit = 10;
  const product = productFactory();
  const product2 = productFactory({ id: 2 });

  let repository: ProductRepository;
  let repositoryError: ProductRepository;
  let prisma: PrismaClient;
  let prismaError: PrismaClient;

  beforeEach(() => {
    prisma = {
      product: {
        create: jest.fn(() => product),
        findMany: jest.fn(() => [product, product2]),
        findFirst: jest.fn(() => product),
        findUnique: jest.fn(() => product),
        update: jest.fn(() => product),
      },
    } as unknown as PrismaClient;
    prismaError = {
      product: {
        create: jest.fn(() => {
          throw e;
        }),
        findMany: jest.fn(() => {
          throw e;
        }),
        findFirst: jest.fn(() => {
          throw e;
        }),
        findUnique: jest.fn(() => {
          throw e;
        }),
        update: jest.fn(() => {
          throw e;
        }),
      },
    } as unknown as PrismaClient;

    repository = new ProductRepository(prisma);
    repositoryError = new ProductRepository(prismaError);
  });

  describe("create", () => {
    test("successfully", async () => {
      const { data, error } = await repository.create({ name: "product", stock_quantity: 20 });

      expect(data).toMatchObject(product);
      expect(error).toBe(null);
      expect(prisma.product.create).toHaveBeenLastCalledWith({
        data: {
          name: "product",
          stock_quantity: 20,
        },
      });
    });

    test("failed", async () => {
      const { data, error } = await repositoryError.create({ name: "product", stock_quantity: 20 });

      expect(data).toBe(null);
      expect(error).toBe(e);
      expect(prismaError.product.create).toHaveBeenLastCalledWith({
        data: {
          name: "product",
          stock_quantity: 20,
        },
      });
    });
  });

  describe("getAll", () => {
    test("successfully", async () => {
      const { data, error } = await repository.getAll();

      expect(data).toMatchObject([product, product2]);
      expect(error).toBe(null);
      expect(prisma.product.findMany).toHaveBeenLastCalledWith({ where: { deleted_at: null } });
    });

    test("failed", async () => {
      const { data, error } = await repositoryError.getAll();

      expect(data).toBe(null);
      expect(error).toBe(e);
      expect(prismaError.product.findMany).toHaveBeenLastCalledWith({ where: { deleted_at: null } });
    });
  });

  describe("getPaginated", () => {
    test("successfully", async () => {
      const { data, error } = await repository.getPaginated(limit, 5);

      expect(data).toMatchObject([product, product2]);
      expect(error).toBe(null);
      expect(prisma.product.findMany).toHaveBeenLastCalledWith({
        where: { deleted_at: null, id: { gt: 5 } },
        take: limit,
      });
    });

    test("successfully - without cursor", async () => {
      const { data, error } = await repository.getPaginated(limit);

      expect(data).toMatchObject([product, product2]);
      expect(error).toBe(null);
      expect(prisma.product.findMany).toHaveBeenLastCalledWith({
        where: { deleted_at: null, id: { gt: 0 } },
        take: limit,
      });
    });

    test("failed", async () => {
      const { data, error } = await repositoryError.getPaginated(limit);

      expect(data).toBe(null);
      expect(error).toBe(e);
      expect(prismaError.product.findMany).toHaveBeenLastCalledWith({
        where: { deleted_at: null, id: { gt: 0 } },
        take: limit,
      });
    });
  });

  describe("getById", () => {
    test("successfully", async () => {
      const { data, error } = await repository.getById(product.id);

      expect(data).toMatchObject(product);
      expect(error).toBe(null);
      expect(prisma.product.findFirst).toHaveBeenLastCalledWith({ where: { id: product.id, deleted_at: null } });
    });

    test("failed", async () => {
      const { data, error } = await repositoryError.getById(product.id);

      expect(data).toBe(null);
      expect(error).toBe(e);
      expect(prismaError.product.findFirst).toHaveBeenLastCalledWith({ where: { id: product.id, deleted_at: null } });
    });
  });

  describe("deleteById", () => {
    test("successfully", async () => {
      const { data, error } = await repository.deleteById(product.id);

      expect(data).toMatchObject(product);
      expect(error).toBe(null);
      expect(prisma.product.findUnique).toHaveBeenLastCalledWith({ where: { id: product.id } });
      expect(prisma.product.update).toHaveBeenLastCalledWith({ where: { id: product.id }, data: { deleted_at: expect.any(Date) } });
    });

    test("failed to find", async () => {
      const { data, error } = await repositoryError.deleteById(product.id);

      expect(data).toBe(null);
      expect(error).toBe(e);
      expect(prismaError.product.findUnique).toHaveBeenLastCalledWith({ where: { id: product.id } });
      expect(prismaError.product.update).toHaveBeenCalledTimes(0);
    });

    test("failed to update", async () => {
      const prisma = {
        product: {
          findUnique: jest.fn(() => product),
          update: jest.fn(() => {
            throw e;
          }),
        },
      } as unknown as PrismaClient;

      const repository = new ProductRepository(prisma);
      const { data, error } = await repository.deleteById(product.id);

      expect(data).toBe(null);
      expect(error).toBe(e);
      expect(prisma.product.findUnique).toHaveBeenLastCalledWith({ where: { id: product.id } });
      expect(prisma.product.update).toHaveBeenLastCalledWith({ where: { id: product.id }, data: { deleted_at: expect.any(Date) } });
    });
  });

  describe("updatedById", () => {
    const dataToUpdate = { name: "new name" };

    test("successfully", async () => {
      const { data, error } = await repository.updateById(product.id, dataToUpdate);

      expect(data).toMatchObject(product);
      expect(error).toBe(null);
      expect(prisma.product.findFirst).toHaveBeenLastCalledWith({ where: { id: product.id, deleted_at: null } });
      expect(prisma.product.update).toHaveBeenLastCalledWith({ where: { id: product.id }, data: dataToUpdate });
    });

    test("failed to find", async () => {
      const { data, error } = await repositoryError.updateById(product.id, dataToUpdate);

      expect(data).toBe(null);
      expect(error).toBe(e);
      expect(prismaError.product.findFirst).toHaveBeenLastCalledWith({ where: { id: product.id, deleted_at: null } });
      expect(prismaError.product.update).toHaveBeenCalledTimes(0);
    });

    test("failed to update", async () => {
      const prisma = {
        product: {
          findFirst: jest.fn(() => product),
          update: jest.fn(() => {
            throw e;
          }),
        },
      } as unknown as PrismaClient;

      const repository = new ProductRepository(prisma);
      const { data, error } = await repository.updateById(product.id, dataToUpdate);

      expect(data).toBe(null);
      expect(error).toBe(e);
      expect(prisma.product.findFirst).toHaveBeenLastCalledWith({ where: { id: product.id, deleted_at: null } });
      expect(prisma.product.update).toHaveBeenLastCalledWith({ where: { id: product.id }, data: dataToUpdate });
    });
  });
});
