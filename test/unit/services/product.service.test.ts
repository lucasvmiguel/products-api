import { ProductRepository } from "@/repositories/product.repository";
import { ProductService } from "@/services/product.service";
import { productFactory } from "../factories/product.factory";

describe("ProductService", () => {
  const e = new Error("error");
  const product = productFactory();
  const product2 = productFactory({ id: 2 });

  let repository: ProductRepository;
  let repositoryError: ProductRepository;
  let service: ProductService;
  let serviceError: ProductService;

  beforeEach(() => {
    repository = {
      create: jest.fn(() => ({ data: product, error: null })),
      getAll: jest.fn(() => ({ data: [product, product], error: null })),
      getPaginated: jest.fn(() => ({ data: [product, product2], error: null })),
      getById: jest.fn(() => ({ data: product, error: null })),
      updateById: jest.fn(() => ({ data: product, error: null })),
      deleteById: jest.fn(() => ({ data: product, error: null })),
    } as unknown as ProductRepository;
    repositoryError = {
      create: jest.fn(() => ({ data: null, error: e })),
      getAll: jest.fn(() => ({ data: null, error: e })),
      getPaginated: jest.fn(() => ({ data: null, error: e })),
      getById: jest.fn(() => ({ data: null, error: e })),
      updateById: jest.fn(() => ({ data: null, error: e })),
      deleteById: jest.fn(() => ({ data: null, error: e })),
    } as unknown as ProductRepository;

    service = new ProductService(repository);
    serviceError = new ProductService(repositoryError);
  });

  describe("create", () => {
    test("successfully", async () => {
      const { data, error } = await service.create({ name: "product", stock_quantity: 20 });

      expect(data).toMatchObject(product);
      expect(error).toBe(null);
      expect(repository.create).toHaveBeenLastCalledWith({
        name: "product",
        stock_quantity: 20,
        code: expect.any(String),
      });
    });

    test("failed", async () => {
      const { data, error } = await serviceError.create({ name: "product", stock_quantity: 20 });

      expect(data).toBe(null);
      expect(error).toBe(error);
      expect(repositoryError.create).toHaveBeenLastCalledWith({
        name: "product",
        stock_quantity: 20,
        code: expect.any(String),
      });
    });
  });

  describe("getAll", () => {
    test("successfully", async () => {
      const { data, error } = await service.getAll();

      expect(data).toMatchObject([product, product]);
      expect(error).toBe(null);
      expect(repository.getAll).toHaveBeenCalledTimes(1);
    });

    test("failed", async () => {
      const { data, error } = await serviceError.getAll();

      expect(data).toBe(null);
      expect(error).toBe(e);
      expect(repositoryError.getAll).toHaveBeenCalledTimes(1);
    });
  });

  describe("getPaginated", () => {
    test("successfully", async () => {
      const { data, error } = await service.getPaginated();

      expect(data.products).toMatchObject([product, product2]);
      expect(data.nextCursor).toBe(product2.id);
      expect(error).toBe(null);
      expect(repository.getPaginated).toHaveBeenLastCalledWith(10, undefined);
    });

    test("successfully - invalid limit", async () => {
      const { data, error } = await service.getPaginated(200);

      expect(data.products).toMatchObject([product, product2]);
      expect(data.nextCursor).toBe(product2.id);
      expect(error).toBe(null);
      expect(repository.getPaginated).toHaveBeenLastCalledWith(10, undefined);
    });

    test("successfully - invalid limit", async () => {
      const { data, error } = await service.getPaginated(-200);

      expect(data.products).toMatchObject([product, product2]);
      expect(data.nextCursor).toBe(product2.id);
      expect(error).toBe(null);
      expect(repository.getPaginated).toHaveBeenLastCalledWith(10, undefined);
    });

    test("failed", async () => {
      const { data, error } = await serviceError.getPaginated(50);

      expect(data.products).toBe(null);
      expect(data.nextCursor).toBe(null);
      expect(error).toBe(e);
      expect(repositoryError.getPaginated).toHaveBeenLastCalledWith(50, undefined);
    });
  });

  describe("getById", () => {
    test("successfully", async () => {
      const { data, error } = await service.getById(product.id);

      expect(data).toMatchObject(product);
      expect(error).toBe(null);
      expect(repository.getById).toHaveBeenLastCalledWith(product.id);
    });

    test("failed", async () => {
      const { data, error } = await serviceError.getById(product.id);

      expect(data).toBe(null);
      expect(error).toBe(e);
      expect(repositoryError.getById).toHaveBeenLastCalledWith(product.id);
    });
  });

  describe("updateById", () => {
    test("successfully", async () => {
      const { data, error } = await service.updateById(product.id, { name: "product", stock_quantity: 20 });

      expect(data).toMatchObject(product);
      expect(error).toBe(null);
      expect(repository.updateById).toHaveBeenLastCalledWith(product.id, {
        name: "product",
        stock_quantity: 20,
      });
    });

    test("failed", async () => {
      const { data, error } = await serviceError.updateById(product.id, { name: "product", stock_quantity: 20 });

      expect(data).toBe(null);
      expect(error).toBe(error);
      expect(repositoryError.updateById).toHaveBeenLastCalledWith(product.id, {
        name: "product",
        stock_quantity: 20,
      });
    });
  });

  describe("deleteById", () => {
    test("successfully", async () => {
      const { data, error } = await service.deleteById(product.id);

      expect(data).toMatchObject(product);
      expect(error).toBe(null);
      expect(repository.deleteById).toHaveBeenLastCalledWith(product.id);
    });

    test("failed", async () => {
      const { data, error } = await serviceError.deleteById(product.id);

      expect(data).toBe(null);
      expect(error).toBe(e);
      expect(repositoryError.deleteById).toHaveBeenLastCalledWith(product.id);
    });
  });
});
