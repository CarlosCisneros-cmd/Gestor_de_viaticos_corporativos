const express = require("express");

module.exports = function (controller) {
  const router = express.Router();

  router.post("/", controller.crear);
  router.get("/", controller.listar);
  router.get("/:id", controller.obtenerPorId);
  router.delete("/:id", controller.eliminar);

  return router;
};