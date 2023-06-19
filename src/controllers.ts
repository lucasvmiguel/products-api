import { ProductController } from "./product/controller";

// Dependencies
import services from "./services";

// Controllers
export = {
  ProductController: new ProductController(services.ProductService),
};
