import type { Router } from "express";

import controllers from "@/controllers";

export default (router: Router) => {
  // Product routes
  router.post("/products", (req, res) => controllers.ProductController.create(req, res));
  router.get("/products", (req, res) => controllers.ProductController.getAll(req, res));
  router.get("/products/:id", (req, res) => controllers.ProductController.getById(req, res));
  router.put("/products/:id", (req, res) => controllers.ProductController.updateById(req, res));
  router.delete("/products/:id", (req, res) => controllers.ProductController.deleteById(req, res));
};
