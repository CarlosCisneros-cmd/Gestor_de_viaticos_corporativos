const express = require("express");
const cors = require("cors");

const { connection: connectPostgres, sequelize } = require("./Infraestructura/database/Postgres"); 
const { connection: connectMongo } = require("./Infraestructura/database/Mongo"); // Importamos y renombramos

// Importación de Módulos existentes
const registerUserModule = require("./lib/Usuario/Infraestructura/http");
const registerDepartamentosModule = require("./lib/Departamentos/Infraestructura/http");

// Importamos los nuevos módulos 
const registerGastoModule = require("./lib/Gastos/Infraestructura/http");
const registerCategoriaModule = require("./lib/Categorias/Infraestructura/http");
const registerViaticoModule = require("./lib/Viaticos/Infraestructura/http");
const registerEvidenciasModule = require("./lib/Evidencias/Infraestructura/http");

async function buildApp() {
  const app = express();

  // 1. Conectar a las Bases de Datos
  try {
    // Conectamos PostgreSQL
    await connectPostgres();
    await sequelize.sync({ alter: true }); 
    console.log("Tablas sincronizadas correctamente.");

    //Llamamos a la función para conectar Mongo
    await connectMongo(); 
    console.log("MongoDB conectado correctamente.");

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
  
  registerViaticoModule(app);
  registerCategoriaModule(app); 
  registerGastoModule(app);
  registerEvidenciasModule(app);
  
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