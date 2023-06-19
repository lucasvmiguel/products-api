import { ProductService } from "./product/service";

// Dependencies
import repositories from "./repositories";

// Services
export = {
  ProductService: new ProductService(repositories.ProductRepository),
};
