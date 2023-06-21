import * as yup from "yup";

import { Product, QueryGetProductArgs } from "@/__generated__/resolvers-types";

import { ProductService } from "@/services/product.service";
import { Resolver } from "./base.resolver";
import { NotFoundError } from "@/repositories/base.repository";
import { validate } from "@/utils/validation.util";

export class ProductResolver extends Resolver {
  private productService: ProductService;

  constructor(productService: ProductService) {
    super();

    this.productService = productService;
  }

  // get product by id
  async getProduct(_: any, args: QueryGetProductArgs, __: any, ___: any): Promise<Product | null> {
    const reqParamsSchema = yup.object({
      id: yup.number().required().positive().integer(),
    });

    const { result, error: errorReqParamsSchema } = await validate(reqParamsSchema, args);
    if (errorReqParamsSchema || !result) {
      this.resolveBadRequest(errorReqParamsSchema!);
      return null;
    }

    const { data, error } = await this.productService.getById(result.id);

    if (error instanceof NotFoundError) {
      this.resolveNotFound(error);
      return null;
    }

    if (error || !data) {
      this.resolveInternalServerError(error!);
      return null;
    }

    return data;
  }
}
