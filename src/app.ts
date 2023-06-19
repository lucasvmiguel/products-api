import cors from "cors";
import express from "express";

import { notFoundMiddleware } from "./utils/middleware/not-found";
import { internalServerErrorMiddleware } from "./utils/middleware/internal-service-error";
import { loggerMiddleware } from "./utils/middleware/logger";

import controllers from "./controllers";

// Initialize express
const app = express();

// Pre middlewares
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors());

// Routes
const router = express.Router();
router.post("/products", (req, res) => controllers.ProductController.create(req, res));
router.get("/products", (req, res) => controllers.ProductController.getAll(req, res));
router.get("/products/:id", (req, res) => controllers.ProductController.getById(req, res));
router.put("/products/:id", (req, res) => controllers.ProductController.updateById(req, res));
router.delete("/products/:id", (req, res) => controllers.ProductController.deleteById(req, res));

// Post middlewares
router.use(notFoundMiddleware);
router.use(internalServerErrorMiddleware);
router.use(loggerMiddleware);

app.use("/api/v1", router);

export default app;
