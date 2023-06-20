import type { PrismaClient } from "@prisma/client";

import { ProductRepository } from "@/repositories/product.repository";

describe("ProductRepository", () => {
  const e = new Error("error");
  const limit = 10;
  const product = {
    id: 1,
    name: "test",
    stock_quantity: 10,
    created_at: new Date(),
    updated_at: new Date(),
  };

  describe("create", () => {
    test("successfully", async () => {
      const prisma = {
        product: {
          create: jest.fn(() => product),
        },
      } as unknown as PrismaClient;

      const productRepository = new ProductRepository(prisma);
      const { data, error } = await productRepository.create({ name: "product", stock_quantity: 20 });

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
      const prisma = {
        product: {
          create: jest.fn(() => {
            throw e;
          }),
        },
      } as unknown as PrismaClient;

      const productRepository = new ProductRepository(prisma);
      const { data, error } = await productRepository.create({ name: "product", stock_quantity: 20 });

      expect(data).toBe(null);
      expect(error).toBe(e);
      expect(prisma.product.create).toHaveBeenLastCalledWith({
        data: {
          name: "product",
          stock_quantity: 20,
        },
      });
    });
  });

  describe("getAll", () => {
    test("successfully", async () => {
      const prisma = {
        product: {
          findMany: jest.fn(() => [product, product]),
        },
      } as unknown as PrismaClient;

      const productRepository = new ProductRepository(prisma);
      const { data, error } = await productRepository.getAll();

      expect(data).toMatchObject([product, product]);
      expect(error).toBe(null);
      expect(prisma.product.findMany).toHaveBeenLastCalledWith({ where: { deleted_at: null } });
    });

    test("failed", async () => {
      const prisma = {
        product: {
          findMany: jest.fn(() => {
            throw e;
          }),
        },
      } as unknown as PrismaClient;

      const productRepository = new ProductRepository(prisma);
      const { data, error } = await productRepository.getAll();

      expect(data).toBe(null);
      expect(error).toBe(e);
      expect(prisma.product.findMany).toHaveBeenLastCalledWith({ where: { deleted_at: null } });
    });
  });

  describe("getPaginated", () => {
    test("successfully", async () => {
      const prisma = {
        product: {
          findMany: jest.fn(() => [product, product]),
        },
      } as unknown as PrismaClient;

      const productRepository = new ProductRepository(prisma);
      const { data, error } = await productRepository.getPaginated(limit, 5);

      expect(data).toMatchObject([product, product]);
      expect(error).toBe(null);
      expect(prisma.product.findMany).toHaveBeenLastCalledWith({
        where: { deleted_at: null, id: { gt: 5 } },
        take: limit,
      });
    });

    test("successfully - without cursor", async () => {
      const prisma = {
        product: {
          findMany: jest.fn(() => [product, product]),
        },
      } as unknown as PrismaClient;

      const productRepository = new ProductRepository(prisma);
      const { data, error } = await productRepository.getPaginated(limit);

      expect(data).toMatchObject([product, product]);
      expect(error).toBe(null);
      expect(prisma.product.findMany).toHaveBeenLastCalledWith({
        where: { deleted_at: null, id: { gt: 0 } },
        take: limit,
      });
    });

    test("failed", async () => {
      const prisma = {
        product: {
          findMany: jest.fn(() => {
            throw e;
          }),
        },
      } as unknown as PrismaClient;

      const productRepository = new ProductRepository(prisma);
      const { data, error } = await productRepository.getPaginated(limit);

      expect(data).toBe(null);
      expect(error).toBe(e);
      expect(prisma.product.findMany).toHaveBeenLastCalledWith({
        where: { deleted_at: null, id: { gt: 0 } },
        take: limit,
      });
    });
  });

  describe("getById", () => {
    test("successfully", async () => {
      const prisma = {
        product: {
          findFirst: jest.fn(() => product),
        },
      } as unknown as PrismaClient;

      const productRepository = new ProductRepository(prisma);
      const { data, error } = await productRepository.getById(product.id);

      expect(data).toMatchObject(product);
      expect(error).toBe(null);
      expect(prisma.product.findFirst).toHaveBeenLastCalledWith({ where: { id: product.id, deleted_at: null } });
    });

    test("failed", async () => {
      const prisma = {
        product: {
          findFirst: jest.fn(() => {
            throw e;
          }),
        },
      } as unknown as PrismaClient;

      const productRepository = new ProductRepository(prisma);
      const { data, error } = await productRepository.getById(product.id);

      expect(data).toBe(null);
      expect(error).toBe(e);
      expect(prisma.product.findFirst).toHaveBeenLastCalledWith({ where: { id: product.id, deleted_at: null } });
    });
  });

  describe("deleteById", () => {
    test("successfully", async () => {
      const prisma = {
        product: {
          findUnique: jest.fn(() => product),
          update: jest.fn(() => product),
        },
      } as unknown as PrismaClient;

      const productRepository = new ProductRepository(prisma);
      const { data, error } = await productRepository.deleteById(product.id);

      expect(data).toMatchObject(product);
      expect(error).toBe(null);
      expect(prisma.product.findUnique).toHaveBeenLastCalledWith({ where: { id: product.id } });
      expect(prisma.product.update).toHaveBeenLastCalledWith({ where: { id: product.id }, data: { deleted_at: expect.any(Date) } });
    });

    test("failed to find", async () => {
      const prisma = {
        product: {
          findUnique: jest.fn(() => {
            throw e;
          }),
          update: jest.fn(() => product),
        },
      } as unknown as PrismaClient;

      const productRepository = new ProductRepository(prisma);
      const { data, error } = await productRepository.deleteById(product.id);

      expect(data).toBe(null);
      expect(error).toBe(e);
      expect(prisma.product.findUnique).toHaveBeenLastCalledWith({ where: { id: product.id } });
      expect(prisma.product.update).toHaveBeenCalledTimes(0);
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

      const productRepository = new ProductRepository(prisma);
      const { data, error } = await productRepository.deleteById(product.id);

      expect(data).toBe(null);
      expect(error).toBe(e);
      expect(prisma.product.findUnique).toHaveBeenLastCalledWith({ where: { id: product.id } });
      expect(prisma.product.update).toHaveBeenLastCalledWith({ where: { id: product.id }, data: { deleted_at: expect.any(Date) } });
    });
  });

  describe("updatedById", () => {
    const dataToUpdate = { name: "new name" };

    test("successfully", async () => {
      const prisma = {
        product: {
          findFirst: jest.fn(() => product),
          update: jest.fn(() => product),
        },
      } as unknown as PrismaClient;

      const productRepository = new ProductRepository(prisma);
      const { data, error } = await productRepository.updateById(product.id, dataToUpdate);

      expect(data).toMatchObject(product);
      expect(error).toBe(null);
      expect(prisma.product.findFirst).toHaveBeenLastCalledWith({ where: { id: product.id, deleted_at: null } });
      expect(prisma.product.update).toHaveBeenLastCalledWith({ where: { id: product.id }, data: dataToUpdate });
    });

    test("failed to find", async () => {
      const prisma = {
        product: {
          findFirst: jest.fn(() => {
            throw e;
          }),
          update: jest.fn(() => product),
        },
      } as unknown as PrismaClient;

      const productRepository = new ProductRepository(prisma);
      const { data, error } = await productRepository.updateById(product.id, dataToUpdate);

      expect(data).toBe(null);
      expect(error).toBe(e);
      expect(prisma.product.findFirst).toHaveBeenLastCalledWith({ where: { id: product.id, deleted_at: null } });
      expect(prisma.product.update).toHaveBeenCalledTimes(0);
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

      const productRepository = new ProductRepository(prisma);
      const { data, error } = await productRepository.updateById(product.id, dataToUpdate);

      expect(data).toBe(null);
      expect(error).toBe(e);
      expect(prisma.product.findFirst).toHaveBeenLastCalledWith({ where: { id: product.id, deleted_at: null } });
      expect(prisma.product.update).toHaveBeenLastCalledWith({ where: { id: product.id }, data: dataToUpdate });
    });
  });
});
