const express = require("express");
const cors = require("cors");
const { connection } = require("./Infraestructura/database/Postgres"); // Tu conexión de Sequelize
const registerUserModule = require("./lib/Usuario/Infraestructura/http"); //

async function buildApp() {
  const app = express();

  // 1. Conectar a la Base de Datos (Crucial para el ORM)
  try {
    await connection();
    //await sequelize.sync(); 

  } catch (error) {
    console.error("Error al inicializar la base de datos:", error);
    process.exit(1); // Detener si no hay base de datos
  }

  // 2. Middlewares
  app.use(cors());
  app.use(express.json());
  app.use(express.urlencoded({ extended: true }));

  // 3. Registro de Módulos (Inyección de Dependencias)
  registerUserModule(app);

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