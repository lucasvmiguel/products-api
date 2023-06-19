import { ProductController } from "@/controllers/product.controller";

// Dependencies
import services from "@/services";

// Controllers
export = {
  ProductController: new ProductController(services.ProductService),
};
