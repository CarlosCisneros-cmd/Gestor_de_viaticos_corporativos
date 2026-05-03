const express = require("express");
const router = express.Router();

module.exports = (controller) => {
  router.post("/", controller.crear);
  // Listar todas las evidencias que le pertenecen a un gasto específico
  router.get("/gasto/:id_gasto", controller.listarPorGasto);
  router.delete("/:id", controller.eliminar);
  
  return router;
};