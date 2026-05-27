const express = require("express");
const router = express.Router();
const {
  uploadMiddleware,
} = require("../../../../Infraestructura/config/cloudinary");

module.exports = (controller) => {
  // 1. Ruta para crear evidencia (Maneja la subida de archivo y luego ejecuta el controlador)
  router.post("/", uploadMiddleware.single("file"), (req, res, next) => {
    controller.crear(req, res, next);
  });

  // 2. Listar todas las evidencias que le pertenecen a un gasto específico
  router.get("/gasto/:id_gasto", (req, res, next) => {
    controller.listarPorGasto(req, res, next);
  });

  // 3. Eliminar una evidencia por ID
  router.delete("/:id", (req, res, next) => {
    controller.eliminar(req, res, next);
  });

  return router;
};
