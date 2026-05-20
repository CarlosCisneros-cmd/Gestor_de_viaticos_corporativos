const express = require("express");
const router = express.Router();

/**
 * Adaptador de Rutas para Gastos
 * Recibe el controlador inyectado desde el index.js del módulo
 */
module.exports = (controller) => {
  // Operación CREAR (POST)
  router.post("/", controller.crear);

  // Operación LISTAR TODOS (GET)
  router.get("/", controller.listar);

  // Operación OBTENER POR ID (GET)
  router.get("/:id", controller.obtenerPorId);

  // Operación ELIMINAR (DELETE)
  router.delete("/:id", controller.eliminar);

  // Operación ACTUALIZAR (PUT)
  router.put("/:id", controller.actualizar);

  // Nueva ruta para listar gastos de un viatico específico
  router.get("/viatico/:id", controller.listarPorViatico);

  return router;
};
