const express = require("express");
const router = express.Router();

/**
 * Recibe el controlador inyectado desde el index.js del módulo
 */
module.exports = (controller) => {
  // 1. RUTAS ESTÁTICAS (Siempre van arriba para que no se confundan con /:id)
  router.get("/estadisticas/gasto-mensual", (req, res) =>
    controller.obtenerEstadisticasMensuales(req, res),
  );
  router.get(
    "/estadisticas/gasto-departamento",
    controller.obtenerEstadisticasPorDepartamento,
  );
  router.post("/", controller.crear);
  router.get("/", controller.listar);
  router.get("/usuario/:id", controller.listarPorUsuario);
  router.get("/:id", controller.obtenerPorId);
  router.delete("/:id", controller.eliminar);
  router.put("/:id", controller.actualizar);

  return router;
};
