import cors from "cors";
import express from "express";

import { PrismaClient } from "@prisma/client";

import { notFoundMiddleware } from "./utils/middlewares/not-found";
import { internalServerErrorMiddleware } from "./utils/middlewares/internal-service-error";
import { loggerMiddleware } from "./utils/middlewares/logger";

// Repositories
import { ProductRepository } from "./product/repository";

// Services
import { ProductService } from "./product/service";

// Controllers
import { ProductController } from "./product/controller";

// Initialize prisma
const prisma = new PrismaClient();

// Initialize express
const app = express();

// Initialize repositories
const productRepository = new ProductRepository(prisma);

// Initialize services
const productService = new ProductService(productRepository);

// Initialize controllers
const productController = new ProductController(productService);

// Pre middlewares
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors());

// Routes
const router = express.Router();
router.post("/products", (req, res) => productController.create(req, res));
router.get("/products", (req, res) => productController.getAll(req, res));
router.get("/products/:id", (req, res) => productController.getById(req, res));
router.put("/products/:id", (req, res) => productController.updateById(req, res));
router.delete("/products/:id", (req, res) => productController.deleteById(req, res));

// Post middlewares
// router.use(notFoundMiddleware);
app.use(internalServerErrorMiddleware);
app.use(loggerMiddleware);

app.use("/api/v1", router);

export default app;
