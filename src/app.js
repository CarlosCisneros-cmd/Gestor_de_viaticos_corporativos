const express = require("express");
const cors = require("cors");
const { connection, sequelize } = require("./Infraestructura/database/Postgres"); 

// Importación de Módulos
const registerUserModule = require("./lib/Usuario/Infraestructura/http");
// 1. Importamos el nuevo módulo de Departamentos
const registerDepartamentosModule = require("./lib/Departamentos/Infraestructura/http");

async function buildApp() {
  const app = express();

  // 1. Conectar a la Base de Datos
  try {
    await connection();
    // sync() se encarga de crear las tablas y las relaciones (FKs) en Postgres
    await sequelize.sync({ alter: true }); 
    console.log("Tablas sincronizadas correctamente.");
  } catch (error) {
    console.error("Error al inicializar la base de datos:", error);
    process.exit(1); 
  }

  // 2. Middlewares
  app.use(cors());
  app.use(express.json());
  app.use(express.urlencoded({ extended: true }));

  // 3. Registro de Módulos (Inyección de Dependencias)
  registerUserModule(app);
  // 2. Registramos el módulo de Departamentos
  registerDepartamentosModule(app);

  // 4. Manejo de rutas no encontradas (404)
  app.use((req, res) => {
    res.status(404).json({ message: "Ruta no encontrada en el servidor ORM" });
  });

  // 5. Manejador de errores global
  app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(err.statusCode || 500).json({
      message: err.message || "Error interno del servidor",
    });
  });

  return app;
}

module.exports = buildApp;