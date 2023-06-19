import { v4 as uuidv4 } from "uuid";

import type { Product } from "@prisma/client";

import type { ProductRepository } from "@/repositories/product.repository";
import { Service } from "@/services/base.service";

// ProductService is the business logic layer for products
export class ProductService extends Service {
  private productRepository: ProductRepository;

  constructor(productRepository: ProductRepository) {
    super();

    this.productRepository = productRepository;
  }

  // creates a new product
  async create({ name, stock_quantity }: Pick<Product, "name" | "stock_quantity">): Promise<{ data: Product | null; error: Error | null }> {
    const { data, error } = await this.productRepository.create({
      code: uuidv4(),
      name,
      stock_quantity,
    });

    return { data, error };
  }

  // returns all products
  async getAll(): Promise<{ data: Product[] | null; error: Error | null }> {
    const { data, error } = await this.productRepository.getAll();

    return { data, error };
  }

  // returns a product by id
  async getById(id: number): Promise<{ data: Product | null; error: Error | null }> {
    const { data, error } = await this.productRepository.getById(id);

    return { data, error };
  }

  // updates a product by id
  async updateById(id: number, { name, stock_quantity }: { name?: string; stock_quantity?: number }): Promise<{ data: Product | null; error: Error | null }> {
    const { data, error } = await this.productRepository.updateById(id, { name, stock_quantity });

    return { data, error };
  }

  // deletes a product by id
  async deleteById(id: number): Promise<{ data: Product | null; error: Error | null }> {
    const { data, error } = await this.productRepository.deleteById(id);

    return { data, error };
  }
}
