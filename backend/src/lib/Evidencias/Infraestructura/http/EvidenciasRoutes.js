const express = require("express");
const router = express.Router();
const {
  uploadMiddleware,
} = require("../../../../Infraestructura/config/cloudinary");

module.exports = (controller) => {
  // 1. Ruta para crear evidencia (Maneja la subida de archivo y luego ejecuta el controlador)
  router.post("/", uploadMiddleware.single("file"), (req, res, next) => {
    // Verificación preventiva por si el método no existe en el controlador recibido
    if (!controller || typeof controller.crear !== "function") {
      return res.status(500).json({
        error:
          "El método 'crear' no está definido en el controlador de evidencias.",
      });
    }
    controller.crear(req, res, next);
  });

  // 2. Listar todas las evidencias que le pertenecen a un gasto específico
  router.get("/gasto/:id_gasto", (req, res, next) => {
    if (!controller || typeof controller.listarPorGasto !== "function") {
      return res
        .status(500)
        .json({ error: "El método 'listarPorGasto' no está definido." });
    }
    controller.listarPorGasto(req, res, next);
  });

  // 3. Eliminar una evidencia por ID
  router.delete("/:id", (req, res, next) => {
    if (!controller || typeof controller.eliminar !== "function") {
      return res
        .status(500)
        .json({ error: "El método 'eliminar' no está definido." });
    }
    controller.eliminar(req, res, next);
  });

  return router;
};
