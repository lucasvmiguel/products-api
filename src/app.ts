import cors from "cors";
import express from "express";

import { notFoundMiddleware } from "@/middlewares/not-found.middleware";
import { internalServerErrorMiddleware } from "@/middlewares/internal-service-error.middleware";
import { loggerMiddleware } from "@/middlewares/logger.middleware";
import routes from "./routes";

// Initialize express
const app = express();

// Pre middlewares
app.use(loggerMiddleware);
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors());

// Routes
const router = express.Router();
routes(router);

// Post middlewares
router.use(notFoundMiddleware);
router.use(internalServerErrorMiddleware);

app.use("/api/v1", router);

export default app;
