import { Resolvers } from "@/__generated__/resolvers-types";

import { ProductResolver } from "./product.resolver";

// Dependencies
import services from "@/services";

// Resolvers
const productResolver = new ProductResolver(services.ProductService);

// Queries and Mutations
const resolvers: Resolvers = {
  Query: {
    getProduct: (parent, args, context, resolveInfo) => productResolver.getProduct(parent, args, context, resolveInfo),
  },
};

export default resolvers;
