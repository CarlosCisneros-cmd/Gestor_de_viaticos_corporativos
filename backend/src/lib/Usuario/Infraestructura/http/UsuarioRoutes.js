const express = require("express");
const router = express.Router();

/**
 * Adaptador de Rutas para Usuario
 * Recibe el controlador inyectado desde el index.js del módulo
 */
module.exports = (controller) => {
  // 👇 NUEVA RUTA PARA AUTENTICACIÓN (POST /api/usuarios/login)
  router.post("/login", controller.login);

  // Actividad 2: Operación CREAR (POST)
  router.post("/", controller.crear);

  // Actividad 2: Operación LISTAR TODOS (GET)
  router.get("/", controller.listar);

  // Actividad 2: Operación OBTENER POR ID (GET)
  router.get("/:id", controller.obtenerPorId);

  // Actividad 2: Operación ELIMINAR (DELETE)
  router.delete("/:id", controller.eliminar);

  // Operación ACTUALIZAR (PUT)
  router.put("/:id", controller.actualizar); 

  return router;
};