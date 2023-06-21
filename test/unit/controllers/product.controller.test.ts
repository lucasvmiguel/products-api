import { Request, Response } from "express";

import { ProductController } from "@/controllers/product.controller";
import { ProductService } from "@/services/product.service";
import { productFactory } from "../factories/product.factory";
import { NotFoundError } from "@/repositories/base.repository";

describe("ProductController", () => {
  const e = new Error("error");
  const product = productFactory();
  const product2 = productFactory({ id: 2 });

  let request: Request;
  let response: Response;
  let service: ProductService;
  let serviceError: ProductService;
  let controller: ProductController;
  let controllerError: ProductController;

  beforeEach(() => {
    service = {
      getAll: jest.fn(() => ({ data: [product, product2], error: null })),
      getById: jest.fn(() => ({ data: product, error: null })),
      deleteById: jest.fn(() => ({ data: product, error: null })),
      create: jest.fn(() => ({ data: product, error: null })),
      updateById: jest.fn(() => ({ data: product, error: null })),
      getPaginated: jest.fn(() => ({ data: { products: [product, product2], nextCursor: product2.id }, error: null })),
    } as unknown as ProductService;
    serviceError = {
      getAll: jest.fn(() => ({ data: null, error: e })),
      getById: jest.fn(() => ({ data: null, error: e })),
      deleteById: jest.fn(() => ({ data: null, error: e })),
      create: jest.fn(() => ({ data: null, error: e })),
      updateById: jest.fn(() => ({ data: null, error: e })),
      getPaginated: jest.fn(() => ({ data: null, error: e })),
    } as unknown as ProductService;

    controller = new ProductController(service);
    controllerError = new ProductController(serviceError);

    request = {} as Request;
    response = {
      status: jest.fn(() => response),
      json: jest.fn(() => response),
      send: jest.fn(() => response),
    } as unknown as Response;
  });

  describe("getAll", () => {
    test("successfully", async () => {
      await controller.getAll(request, response);

      expect(response.status).toHaveBeenLastCalledWith(200);
      expect(response.json).toHaveBeenCalledWith({
        data: [
          { ...product, deleted_at: undefined },
          { ...product2, deleted_at: undefined },
        ],
        message: "success",
      });
    });

    test("failed", async () => {
      await controllerError.getAll(request, response);

      expect(response.status).toHaveBeenLastCalledWith(500);
      expect(response.json).toHaveBeenCalledWith({
        message: "internal server error",
      });
    });
  });

  describe("getPaginated", () => {
    test("successfully", async () => {
      const request = { query: { limit: 2, cursor: 2 } } as unknown as Request;
      await controller.getPaginated(request, response);

      expect(response.status).toHaveBeenLastCalledWith(200);
      expect(response.json).toHaveBeenCalledWith({
        data: {
          items: [
            { ...product, deleted_at: undefined },
            { ...product2, deleted_at: undefined },
          ],
          next_cursor: product2.id,
        },
        message: "success",
      });
    });

    test("failed service", async () => {
      const request = { query: { limit: 2, cursor: 2 } } as unknown as Request;
      await controllerError.getPaginated(request, response);

      expect(response.status).toHaveBeenLastCalledWith(500);
      expect(response.json).toHaveBeenCalledWith({
        message: "internal server error",
      });
    });

    test("failed validation", async () => {
      const request = { query: { limit: "invalid", cursor: 2 } } as unknown as Request;
      await controllerError.getPaginated(request, response);

      expect(response.status).toHaveBeenLastCalledWith(400);
      expect(response.json).toHaveBeenCalledWith({
        errors: ['limit must be a `number` type, but the final value was: `NaN` (cast from the value `"invalid"`).'],
        message: "invalid request parameters",
      });
    });
  });

  describe("getById", () => {
    test("successfully", async () => {
      const request = { params: { id: product.id } } as unknown as Request;
      await controller.getById(request, response);

      expect(response.status).toHaveBeenLastCalledWith(200);
      expect(response.json).toHaveBeenCalledWith({
        data: { ...product, deleted_at: undefined },
        message: "success",
      });
    });

    test("failed service", async () => {
      const request = { params: { id: product.id } } as unknown as Request;
      await controllerError.getById(request, response);

      expect(response.status).toHaveBeenLastCalledWith(500);
      expect(response.json).toHaveBeenCalledWith({
        message: "internal server error",
      });
    });

    test("failed validation", async () => {
      const request = { params: { id: "invalid" } } as unknown as Request;
      await controllerError.getById(request, response);

      expect(response.status).toHaveBeenLastCalledWith(400);
      expect(response.json).toHaveBeenCalledWith({
        errors: ['id must be a `number` type, but the final value was: `NaN` (cast from the value `"invalid"`).'],
        message: "invalid request parameters",
      });
    });

    test("not found", async () => {
      const service = {
        getById: jest.fn(() => ({ data: product, error: new NotFoundError() })),
      } as unknown as ProductService;

      const controller = new ProductController(service);
      const request = { params: { id: product.id } } as unknown as Request;
      await controller.getById(request, response);

      expect(response.status).toHaveBeenLastCalledWith(404);
    });
  });

  describe("deleteById", () => {
    test("successfully", async () => {
      const request = { params: { id: product.id } } as unknown as Request;
      await controller.deleteById(request, response);

      expect(response.status).toHaveBeenLastCalledWith(204);
      expect(response.send).toHaveBeenCalledTimes(1);
    });

    test("failed service", async () => {
      const request = { params: { id: product.id } } as unknown as Request;
      await controllerError.deleteById(request, response);

      expect(response.status).toHaveBeenLastCalledWith(500);
      expect(response.json).toHaveBeenCalledWith({
        message: "internal server error",
      });
    });

    test("failed validation", async () => {
      const request = { params: { id: "invalid" } } as unknown as Request;
      await controllerError.deleteById(request, response);

      expect(response.status).toHaveBeenLastCalledWith(400);
      expect(response.json).toHaveBeenCalledWith({
        errors: ['id must be a `number` type, but the final value was: `NaN` (cast from the value `"invalid"`).'],
        message: "invalid request parameters",
      });
    });

    test("not found", async () => {
      const service = {
        deleteById: jest.fn(() => ({ data: product, error: new NotFoundError() })),
      } as unknown as ProductService;

      const controller = new ProductController(service);
      const request = { params: { id: product.id } } as unknown as Request;
      await controller.deleteById(request, response);

      expect(response.status).toHaveBeenLastCalledWith(404);
    });
  });

  describe("create", () => {
    test("successfully", async () => {
      const request = { body: { name: product.name, stock_quantity: product.stock_quantity } } as unknown as Request;
      await controller.create(request, response);

      expect(response.status).toHaveBeenLastCalledWith(201);
      expect(response.json).toHaveBeenCalledWith({
        data: { ...product, deleted_at: undefined },
        message: "created",
      });
    });

    test("failed service", async () => {
      const request = { body: { name: product.name, stock_quantity: product.stock_quantity } } as unknown as Request;
      await controllerError.create(request, response);

      expect(response.status).toHaveBeenLastCalledWith(500);
      expect(response.json).toHaveBeenCalledWith({
        message: "internal server error",
      });
    });

    test("failed validation", async () => {
      const request = { body: { name: product.name, stock_quantity: "invalid" } } as unknown as Request;
      await controllerError.create(request, response);

      expect(response.status).toHaveBeenLastCalledWith(400);
      expect(response.json).toHaveBeenCalledWith({
        errors: ['stock_quantity must be a `number` type, but the final value was: `NaN` (cast from the value `"invalid"`).'],
        message: "invalid request parameters",
      });
    });
  });

  describe("updateById", () => {
    test("successfully", async () => {
      const request = {
        params: { id: product.id },
        body: { name: product.name, stock_quantity: product.stock_quantity },
      } as unknown as Request;

      await controller.updateById(request, response);

      expect(response.status).toHaveBeenLastCalledWith(200);
      expect(response.json).toHaveBeenCalledWith({
        data: { ...product, deleted_at: undefined },
        message: "success",
      });
    });

    test("failed service", async () => {
      const request = {
        params: { id: product.id },
        body: { name: product.name, stock_quantity: product.stock_quantity },
      } as unknown as Request;

      await controllerError.updateById(request, response);

      expect(response.status).toHaveBeenLastCalledWith(500);
      expect(response.json).toHaveBeenCalledWith({
        message: "internal server error",
      });
    });

    test("failed validation - params", async () => {
      const request = {
        params: { id: "invalid" },
        body: { name: product.name, stock_quantity: product.stock_quantity },
      } as unknown as Request;

      await controller.updateById(request, response);

      expect(response.status).toHaveBeenLastCalledWith(400);
      expect(response.json).toHaveBeenCalledWith({
        errors: ['params.id must be a `number` type, but the final value was: `NaN` (cast from the value `"invalid"`).'],
        message: "invalid request parameters",
      });
    });

    test("failed validation - body", async () => {
      const request = {
        params: { id: product.id },
        body: { name: product.name, stock_quantity: "invalid" },
      } as unknown as Request;

      await controller.updateById(request, response);

      expect(response.status).toHaveBeenLastCalledWith(400);
      expect(response.json).toHaveBeenCalledWith({
        errors: ['body.stock_quantity must be a `number` type, but the final value was: `NaN` (cast from the value `"invalid"`).'],
        message: "invalid request parameters",
      });
    });

    test("not found", async () => {
      const service = {
        updateById: jest.fn(() => ({ data: product, error: new NotFoundError() })),
      } as unknown as ProductService;

      const controller = new ProductController(service);
      const request = { params: { id: product.id } } as unknown as Request;
      await controller.updateById(request, response);

      expect(response.status).toHaveBeenLastCalledWith(404);
    });
  });
});
