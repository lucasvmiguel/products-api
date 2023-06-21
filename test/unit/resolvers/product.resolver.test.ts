import { ProductService } from "@/services/product.service";
import { productFactory } from "../factories/product.factory";
import { ProductResolver } from "@/resolvers/product.resolver";
import { ApolloError } from "apollo-server-express";
import { BadRequestError, InternalServerError } from "@/resolvers/base.resolver";
import { NotFoundError as RepositoryNotFoundError } from "@/repositories/base.repository";
import { NotFoundError as ResolverNotFoundError } from "@/resolvers/base.resolver";

describe("ProductController", () => {
  const e = new Error("error");
  const product = productFactory();

  let service: ProductService;
  let serviceError: ProductService;
  let resolver: ProductResolver;
  let resolverError: ProductResolver;

  beforeEach(() => {
    service = {
      getById: jest.fn(() => ({ data: product, error: null })),
    } as unknown as ProductService;
    serviceError = {
      getById: jest.fn(() => ({ data: null, error: e })),
    } as unknown as ProductService;

    resolver = new ProductResolver(service);
    resolverError = new ProductResolver(serviceError);
  });

  describe("getById", () => {
    const args = { id: product.id };

    test("successfully", async () => {
      const data = await resolver.getProduct({}, args, {}, {});

      expect(data).toMatchObject(product);
      expect(service.getById).toHaveBeenCalledWith(product.id);
    });

    test("failed service", async () => {
      try {
        await resolverError.getProduct({}, args, {}, {});

        expect(true).toBe(false);
      } catch (error) {
        expect(error).toBeInstanceOf(InternalServerError);
        expect(serviceError.getById).toHaveBeenCalledWith(product.id);
      }
    });

    test("failed validation", async () => {
      try {
        await resolver.getProduct({}, {}, {}, {});

        expect(true).toBe(false);
      } catch (error) {
        expect(error).toBeInstanceOf(BadRequestError);
        expect(serviceError.getById).toHaveBeenCalledTimes(0);
      }
    });

    test("not found service", async () => {
      const service = {
        getById: jest.fn(() => ({ data: null, error: new RepositoryNotFoundError() })),
      } as unknown as ProductService;
      const resolver = new ProductResolver(service);

      try {
        await resolver.getProduct({}, args, {}, {});

        expect(true).toBe(false);
      } catch (error) {
        expect(error).toBeInstanceOf(ResolverNotFoundError);
        expect(service.getById).toHaveBeenCalledWith(product.id);
      }
    });
  });
});
