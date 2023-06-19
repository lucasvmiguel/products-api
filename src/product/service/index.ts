import { v4 as uuidv4 } from "uuid";

import type { Product } from "@prisma/client";

import type { ProductRepository } from "../repository";

export class ProductService {
  private productRepository: ProductRepository;

  constructor(productRepository: ProductRepository) {
    this.productRepository = productRepository;
  }

  async create({ name, stock_quantity }: Pick<Product, "name" | "stock_quantity">): Promise<{ data: Product | null; error: Error | null }> {
    const { data, error } = await this.productRepository.create({
      code: uuidv4(),
      name,
      stock_quantity,
    });

    return { data, error };
  }

  async getAll(): Promise<{ data: Product[] | null; error: Error | null }> {
    const { data, error } = await this.productRepository.getAll();

    return { data, error };
  }

  async getById(id: number): Promise<{ data: Product | null; error: Error | null }> {
    const { data, error } = await this.productRepository.getById(id);

    return { data, error };
  }

  async updateById(id: number, { name, stock_quantity }: { name?: string; stock_quantity?: number }): Promise<{ data: Product | null; error: Error | null }> {
    const { data, error } = await this.productRepository.updateById(id, { name, stock_quantity });

    return { data, error };
  }

  async deleteById(id: number): Promise<{ data: Product | null; error: Error | null }> {
    const { data, error } = await this.productRepository.deleteById(id);

    return { data, error };
  }
}
