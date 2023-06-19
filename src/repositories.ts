import { PrismaClient } from "@prisma/client";

import { ProductRepository } from "./product/repository";

// Dependencies
const prisma = new PrismaClient();

// Repositories
export = {
  ProductRepository: new ProductRepository(prisma),
};
