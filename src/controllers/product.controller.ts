import type { Request } from "express";
import * as yup from "yup";

import type { Product } from "@prisma/client";

import type { ProductService } from "@/services/product.service";
import { NotFoundError } from "@/repositories/base.repository";
import { validate } from "@/utils/validation";
import { Controller, StructuredResponse } from "@/controllers/base.controller";

// ProductResponseBody is the response body for a product
type ProductResponseBody = {
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
      name: yup.string(),
      stock_quantity: yup.number().positive().integer(),
    });

    const { result, error: errorReqParamsSchema } = await validate(reqParamsSchema, req.body);
    if (errorReqParamsSchema || !result) {
      this.respondBadRequest(res, errorReqParamsSchema!);
      return;
    }

    const { data, error: errorService } = await this.productService.updateById(Number(req.params.id), result);
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
