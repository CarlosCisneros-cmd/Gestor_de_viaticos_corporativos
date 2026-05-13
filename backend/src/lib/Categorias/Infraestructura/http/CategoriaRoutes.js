const express = require("express");
const router = express.Router();

/**
 * Adaptador de Rutas para Categorías
 */
module.exports = (controller) => {
  router.post("/", controller.crear);
  router.get("/", controller.listar);
  router.get("/:id", controller.obtenerPorId);
  router.delete("/:id", controller.eliminar);
  router.put("/:id", controller.actualizar);

  return router;
};