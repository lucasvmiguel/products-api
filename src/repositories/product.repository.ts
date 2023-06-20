import type { PrismaClient, Product, Prisma } from "@prisma/client";

import { NotFoundError, Repository } from "@/repositories/base.repository";

// ProductRepository is the data access layer for products
export class ProductRepository extends Repository {
  private prisma: PrismaClient;

  constructor(prisma: PrismaClient) {
    super();

    this.prisma = prisma;
  }

  // creates a new product
  async create(data: Prisma.ProductCreateInput): Promise<{ data: Product | null; error: Error | null }> {
    try {
      const product = await this.prisma.product.create({ data });

      return { data: product, error: null };
    } catch (e) {
      return { data: null, error: e as Error };
    }
  }

  // returns all products
  async getAll(): Promise<{ data: Product[] | null; error: Error | null }> {
    try {
      const products = await this.prisma.product.findMany({ where: { deleted_at: null } });

      return { data: products, error: null };
    } catch (e) {
      return { data: null, error: e as Error };
    }
  }

  // returns products paginated
  async getPaginated(limit: number, cursor?: number): Promise<{ data: Product[] | null; error: Error | null }> {
    try {
      cursor = cursor || 0;
      const products = await this.prisma.product.findMany({
        where: { deleted_at: null, id: { gt: cursor } },
        take: limit,
      });

      return { data: products, error: null };
    } catch (e) {
      return { data: null, error: e as Error };
    }
  }

  // returns a product by id
  async getById(id: number): Promise<{ data: Product | null; error: Error | null }> {
    try {
      const product = await this.prisma.product.findFirst({ where: { id, deleted_at: null } });
      if (!product) {
        return { data: null, error: new NotFoundError("not found") };
      }

      return { data: product, error: null };
    } catch (e) {
      return { data: null, error: e as Error };
    }
  }

  // updates a product by id
  async updateById(id: number, data: Prisma.ProductUpdateInput): Promise<{ data: Product | null; error: Error | null }> {
    try {
      const product = await this.prisma.product.findFirst({ where: { id, deleted_at: null } });
      if (!product) {
        return { data: null, error: new NotFoundError("not found") };
      }

      const updated = await this.prisma.product.update({ where: { id }, data });

      return { data: updated, error: null };
    } catch (e) {
      return { data: null, error: e as Error };
    }
  }

  // deletes a product by id
  async deleteById(id: number): Promise<{ data: Product | null; error: Error | null }> {
    try {
      const product = await this.prisma.product.findUnique({ where: { id } });
      if (!product) {
        return { data: null, error: new NotFoundError("not found") };
      }

      const deleted = await this.prisma.product.update({ where: { id }, data: { deleted_at: new Date() } });

      return { data: deleted, error: null };
    } catch (e) {
      return { data: null, error: e as Error };
    }
  }
}
