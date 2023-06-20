import { ProductRepository } from "@/repositories/product.repository";
import { ProductService } from "@/services/product.service";

describe("ProductService", () => {
  const e = new Error("error");
  const product = {
    id: 1,
    name: "test",
    stock_quantity: 10,
    created_at: new Date(),
    updated_at: new Date(),
  };

  describe("create", () => {
    test("successfully", async () => {
      const productRepository = {
        create: jest.fn(() => ({ data: product, error: null })),
      } as unknown as ProductRepository;

      const productService = new ProductService(productRepository);
      const { data, error } = await productService.create({ name: "product", stock_quantity: 20 });

      expect(data).toMatchObject(product);
      expect(error).toBe(null);
      expect(productRepository.create).toHaveBeenLastCalledWith({
        name: "product",
        stock_quantity: 20,
        code: expect.any(String),
      });
    });

    test("failed", async () => {
      const productRepository = {
        create: jest.fn(() => ({ data: null, error: e })),
      } as unknown as ProductRepository;

      const productService = new ProductService(productRepository);
      const { data, error } = await productService.create({ name: "product", stock_quantity: 20 });

      expect(data).toBe(null);
      expect(error).toBe(error);
      expect(productRepository.create).toHaveBeenLastCalledWith({
        name: "product",
        stock_quantity: 20,
        code: expect.any(String),
      });
    });
  });

  describe("getAll", () => {
    test("successfully", async () => {
      const productRepository = {
        getAll: jest.fn(() => ({ data: [product, product], error: null })),
      } as unknown as ProductRepository;

      const productService = new ProductService(productRepository);
      const { data, error } = await productService.getAll();

      expect(data).toMatchObject([product, product]);
      expect(error).toBe(null);
      expect(productRepository.getAll).toHaveBeenCalledTimes(1);
    });

    test("failed", async () => {
      const productRepository = {
        getAll: jest.fn(() => ({ data: null, error: e })),
      } as unknown as ProductRepository;

      const productService = new ProductService(productRepository);
      const { data, error } = await productService.getAll();

      expect(data).toBe(null);
      expect(error).toBe(e);
      expect(productRepository.getAll).toHaveBeenCalledTimes(1);
    });
  });

  describe("getPaginated", () => {
    test("successfully", async () => {
      const product2 = { ...product, id: 2 };
      const productRepository = {
        getPaginated: jest.fn(() => ({ data: [product, product2], error: null })),
      } as unknown as ProductRepository;

      const productService = new ProductService(productRepository);
      const { data, error } = await productService.getPaginated();

      expect(data.products).toMatchObject([product, product2]);
      expect(data.nextCursor).toBe(2);
      expect(error).toBe(null);
      expect(productRepository.getPaginated).toHaveBeenLastCalledWith(10, undefined);
    });

    test("successfully - invalid limit", async () => {
      const productRepository = {
        getPaginated: jest.fn(() => ({ data: [product, product], error: null })),
      } as unknown as ProductRepository;

      const productService = new ProductService(productRepository);
      const { data, error } = await productService.getPaginated(200);

      expect(data.products).toMatchObject([product, product]);
      expect(data.nextCursor).toBe(1);
      expect(error).toBe(null);
      expect(productRepository.getPaginated).toHaveBeenLastCalledWith(10, undefined);
    });

    test("successfully - invalid limit", async () => {
      const productRepository = {
        getPaginated: jest.fn(() => ({ data: [product, product], error: null })),
      } as unknown as ProductRepository;

      const productService = new ProductService(productRepository);
      const { data, error } = await productService.getPaginated(-200);

      expect(data.products).toMatchObject([product, product]);
      expect(data.nextCursor).toBe(1);
      expect(error).toBe(null);
      expect(productRepository.getPaginated).toHaveBeenLastCalledWith(10, undefined);
    });

    test("failed", async () => {
      const productRepository = {
        getPaginated: jest.fn(() => ({ data: null, error: e })),
      } as unknown as ProductRepository;

      const productService = new ProductService(productRepository);
      const { data, error } = await productService.getPaginated(50);

      expect(data.products).toBe(null);
      expect(data.nextCursor).toBe(null);
      expect(error).toBe(e);
      expect(productRepository.getPaginated).toHaveBeenLastCalledWith(50, undefined);
    });
  });

  describe("getById", () => {
    test("successfully", async () => {
      const productRepository = {
        getById: jest.fn(() => ({ data: product, error: null })),
      } as unknown as ProductRepository;

      const productService = new ProductService(productRepository);
      const { data, error } = await productService.getById(product.id);

      expect(data).toMatchObject(product);
      expect(error).toBe(null);
      expect(productRepository.getById).toHaveBeenLastCalledWith(product.id);
    });

    test("failed", async () => {
      const productRepository = {
        getById: jest.fn(() => ({ data: null, error: e })),
      } as unknown as ProductRepository;

      const productService = new ProductService(productRepository);
      const { data, error } = await productService.getById(product.id);

      expect(data).toBe(null);
      expect(error).toBe(e);
      expect(productRepository.getById).toHaveBeenLastCalledWith(product.id);
    });
  });

  describe("updateById", () => {
    test("successfully", async () => {
      const productRepository = {
        updateById: jest.fn(() => ({ data: product, error: null })),
      } as unknown as ProductRepository;

      const productService = new ProductService(productRepository);
      const { data, error } = await productService.updateById(product.id, { name: "product", stock_quantity: 20 });

      expect(data).toMatchObject(product);
      expect(error).toBe(null);
      expect(productRepository.updateById).toHaveBeenLastCalledWith(product.id, {
        name: "product",
        stock_quantity: 20,
      });
    });

    test("failed", async () => {
      const productRepository = {
        updateById: jest.fn(() => ({ data: null, error: e })),
      } as unknown as ProductRepository;

      const productService = new ProductService(productRepository);
      const { data, error } = await productService.updateById(product.id, { name: "product", stock_quantity: 20 });

      expect(data).toBe(null);
      expect(error).toBe(error);
      expect(productRepository.updateById).toHaveBeenLastCalledWith(product.id, {
        name: "product",
        stock_quantity: 20,
      });
    });
  });

  describe("deleteById", () => {
    test("successfully", async () => {
      const productRepository = {
        deleteById: jest.fn(() => ({ data: product, error: null })),
      } as unknown as ProductRepository;

      const productService = new ProductService(productRepository);
      const { data, error } = await productService.deleteById(product.id);

      expect(data).toMatchObject(product);
      expect(error).toBe(null);
      expect(productRepository.deleteById).toHaveBeenLastCalledWith(product.id);
    });

    test("failed", async () => {
      const productRepository = {
        deleteById: jest.fn(() => ({ data: null, error: e })),
      } as unknown as ProductRepository;

      const productService = new ProductService(productRepository);
      const { data, error } = await productService.deleteById(product.id);

      expect(data).toBe(null);
      expect(error).toBe(e);
      expect(productRepository.deleteById).toHaveBeenLastCalledWith(product.id);
    });
  });
});
