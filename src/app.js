const express = require("express");
const cors = require("cors");
const { connection, sequelize } = require("./Infraestructura/database/Postgres"); 

// Importación de Módulos existentes
const registerUserModule = require("./lib/Usuario/Infraestructura/http");
const registerDepartamentosModule = require("./lib/Departamentos/Infraestructura/http");

// 1. Importamos los nuevos módulos 
const registerGastoModule = require("./lib/Gastos/Infraestructura/http");
const registerCategoriaModule = require("./lib/Categorias/Infraestructura/http");
const registerViaticoModule = require("./lib/Viaticos/Infraestructura/http");


async function buildApp() {
  const app = express();

  // 1. Conectar a la Base de Datos
  try {
    await connection();
    
    // IMPORTANTE: Aquí podrías importar tus modelos manualmente si ves que 
    // sequelize.sync() no detecta las relaciones al inicio.
    
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
  registerDepartamentosModule(app);
  
  // 2. Registramos los nuevos módulos
  registerViaticoModule(app);
  registerCategoriaModule(app); // Se recomienda registrar categorías antes que gastos
  registerGastoModule(app);
  

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