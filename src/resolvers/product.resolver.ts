import { ApolloError } from "apollo-server-express";

import { Product, QueryGetProductArgs } from "@/__generated__/resolvers-types";

import { ProductService } from "@/services/product.service";
import { Resolver } from "./base.resolver";
import { NotFoundError } from "@/repositories/base.repository";

export class ProductResolver extends Resolver {
  private productService: ProductService;

  constructor(productService: ProductService) {
    super();

    this.productService = productService;
  }

  // get product by id
  async getProduct(_: any, args: QueryGetProductArgs, __: any, ___: any): Promise<Product | null> {
    const { data, error } = await this.productService.getById(args.id!);

    if (error instanceof NotFoundError) {
      this.resolveNotFound(error);
    }

    if (error || !data) {
      this.resolveInternalServerError(error!);
    }

    return data;
  }
}
