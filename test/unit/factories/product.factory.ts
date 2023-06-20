import { faker } from "@faker-js/faker";

import { Product } from "@prisma/client";

export const productFactory = (product: Partial<Product> = {}): Product => {
  return {
    id: faker.number.int(),
    name: faker.commerce.productName(),
    stock_quantity: faker.number.int(),
    code: faker.string.uuid(),
    deleted_at: null,
    created_at: faker.date.recent(),
    updated_at: faker.date.recent(),
    ...product,
  };
};
