import type { Request } from "express";
import * as yup from "yup";

import type { Product } from "@prisma/client";

import type { ProductService } from "@/services/product.service";
import type { PaginationResult } from "@/utils/pagination.util";
import { NotFoundError } from "@/repositories/base.repository";
import { validate } from "@/utils/validation.util";
import { Controller, StructuredResponse } from "@/controllers/base.controller";

// ProductResponseBody is the response body for a product
export type ProductResponseBody = {
  id: number;
  name: string;
  code: string;
  stock_quantity: number;
  created_at: Date;
  updated_at: Date;
};

// ProductController is the controller layer for products
export class ProductController extends Controller {
  private productService: ProductService;

  constructor(productService: ProductService) {
    super();

    this.productService = productService;
  }

  // creates a product
  async create(req: Request, res: StructuredResponse<ProductResponseBody>) {
    const reqParamsSchema = yup.object({
      name: yup.string().required(),
      stock_quantity: yup.number().required().positive().integer(),
    });

    const { result, error: errorReqParamsSchema } = await validate(reqParamsSchema, req.body);
    if (errorReqParamsSchema || !result) {
      this.respondBadRequest(res, errorReqParamsSchema!);
      return;
    }

    const { data, error: errorService } = await this.productService.create(result);
    if (errorService || !data) {
      this.respondInternalServerError(res, errorService!);
      return;
    }

    this.respondCreatedResponse(res, this.mapProductToResponse(data));
  }

  // updates a product by id
  async updateById(req: Request, res: StructuredResponse<ProductResponseBody>) {
    const reqParamsSchema = yup.object({
      params: yup.object({
        id: yup.number().required().positive().integer(),
      }),
      body: yup.object({
        name: yup.string(),
        stock_quantity: yup.number().positive().integer(),
      }),
    });

    const { result, error: errorReqParamsSchema } = await validate(reqParamsSchema, { body: req.body, params: req.params });
    if (errorReqParamsSchema || !result) {
      this.respondBadRequest(res, errorReqParamsSchema!);
      return;
    }

    const { data, error: errorService } = await this.productService.updateById(result.params.id, result.body);
    if (errorService instanceof NotFoundError) {
      this.respondNotFound(res, errorService!);
      return;
    }

    if (errorService || !data) {
      this.respondInternalServerError(res, errorService!);
      return;
    }

    this.respondOkResponse(res, this.mapProductToResponse(data));
  }

  // gets all products
  async getAll(req: Request, res: StructuredResponse<ProductResponseBody[]>) {
    const { data, error } = await this.productService.getAll();
    if (error || !data) {
      this.respondInternalServerError(res, error!);
      return;
    }

    this.respondOkResponse(
      res,
      data.map((product) => this.mapProductToResponse(product))
    );
  }

  // gets products paginated
  async getPaginated(req: Request, res: StructuredResponse<PaginationResult<ProductResponseBody>>) {
    const reqParamsSchema = yup.object({
      limit: yup.number().positive().integer(),
      cursor: yup.number().positive().integer(),
    });
    const { result, error: errorReqParamsSchema } = await validate(reqParamsSchema, req.query);
    if (errorReqParamsSchema || !result) {
      this.respondBadRequest(res, errorReqParamsSchema!);
      return;
    }

    const { data, error } = await this.productService.getPaginated(result.limit, result.cursor);
    if (error || !data) {
      this.respondInternalServerError(res, error!);
      return;
    }

    const items = data.products?.map((product) => this.mapProductToResponse(product)) || [];

    this.respondOkResponse(res, { items, next_cursor: data.nextCursor });
  }

  // gets product by id
  async getById(req: Request, res: StructuredResponse<ProductResponseBody>) {
    const reqParamsSchema = yup.object({
      id: yup.number().required().positive().integer(),
    });

    const { result, error: errorReqParamsSchema } = await validate(reqParamsSchema, req.params);
    if (errorReqParamsSchema || !result) {
      this.respondBadRequest(res, errorReqParamsSchema!);
      return;
    }

    const { data, error } = await this.productService.getById(Number(req.params.id));
    if (error instanceof NotFoundError) {
      this.respondNotFound(res, error!);
      return;
    }

    if (error || !data) {
      this.respondInternalServerError(res, error!);
      return;
    }

    this.respondOkResponse(res, this.mapProductToResponse(data));
  }

  // deletes product by id
  async deleteById(req: Request, res: StructuredResponse<ProductResponseBody>) {
    const reqParamsSchema = yup.object({
      id: yup.number().required().positive().integer(),
    });

    const { result, error: errorReqParamsSchema } = await validate(reqParamsSchema, req.params);
    if (errorReqParamsSchema || !result) {
      this.respondBadRequest(res, errorReqParamsSchema!);
      return;
    }

    const { data, error } = await this.productService.deleteById(Number(req.params.id));
    if (error instanceof NotFoundError) {
      this.respondNotFound(res, error!);
      return;
    }

    if (error || !data) {
      this.respondInternalServerError(res, error!);
      return;
    }

    this.respondNoContentResponse(res);
  }

  // maps product to response
  private mapProductToResponse(product: Product): ProductResponseBody {
    return {
      id: product.id,
      name: product.name,
      code: product.code,
      stock_quantity: product.stock_quantity,
      created_at: product.created_at,
      updated_at: product.updated_at,
    };
  }
}
