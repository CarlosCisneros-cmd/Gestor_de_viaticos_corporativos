const express = require("express");
const router = express.Router();

/**
 * Recibe el controlador inyectado desde el index.js del módulo
 */
module.exports = (controller) => {
  //                                 (POST)
  router.post("/", controller.crear);

  //                                 (GET)
  router.get("/", controller.listar);

  //                                 (GET)
  router.get("/:id", controller.obtenerPorId);

  //                                (DELETE)
  router.delete("/:id", controller.eliminar);
  //                                   (EDIT)
  router.put("/:id", controller.actualizar); 

  return router;
};