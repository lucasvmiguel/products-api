import fs from "fs";
import path from "path";
import cors from "cors";
import express from "express";
import { ApolloServer } from "apollo-server-express";

import { notFoundMiddleware } from "@/middlewares/not-found.middleware";
import { internalServerErrorMiddleware } from "@/middlewares/internal-service-error.middleware";
import { loggerMiddleware } from "@/middlewares/logger.middleware";
import routes from "./routes";
import resolvers from "./resolvers";

// Construct a schema, using GraphQL schema language
const typeDefs = fs.readFileSync(path.join(__dirname, "./schema.graphql"), "utf8");

// Initialize apollo server
const server = new ApolloServer({ typeDefs, resolvers });

// Initialize express and graphql
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

server.start().then((res) => {
  server.applyMiddleware({ app });
});

export default app;
