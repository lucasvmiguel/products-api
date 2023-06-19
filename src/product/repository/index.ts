import type { PrismaClient, Product, Prisma } from "@prisma/client";
import { NotFoundError } from "../../utils/repository";

export class ProductRepository {
  private prisma: PrismaClient;

  constructor(prisma: PrismaClient) {
    this.prisma = prisma;
  }

  async create(data: Prisma.ProductCreateInput): Promise<{ data: Product | null; error: Error | null }> {
    try {
      const product = await this.prisma.product.create({ data });

      return { data: product, error: null };
    } catch (e) {
      return { data: null, error: e as Error };
    }
  }

  async getAll(): Promise<{ data: Product[] | null; error: Error | null }> {
    try {
      const products = await this.prisma.product.findMany({ where: { deleted_at: null } });

      return { data: products, error: null };
    } catch (e) {
      return { data: null, error: e as Error };
    }
  }

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
