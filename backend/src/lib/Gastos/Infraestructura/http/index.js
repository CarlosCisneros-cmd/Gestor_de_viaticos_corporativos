const GastosRoutes = require("./GastosRoutes");
const GastosController = require("./GastosController");

// Repositorio de Sequelize para Gastos
const GastosRepositorySequelize = require("../GastosRepositorySequelize");

// Importamos los Casos de Uso (Arquitectura Hexagonal)
const CrearGastos = require("../../Aplicacion/CrearGastos");
const ListarGastos = require("../../Aplicacion/ListarGastos");
const ListarPorId = require("../../Aplicacion/ListarPorId");
const ActualizarGastos = require("../../Aplicacion/ActualizarGastos");
const EliminarGastos = require("../../Aplicacion/EliminarGastos");
const ListarPorViatico = require("../../Aplicacion/ListarPorViatico");

module.exports = function registerGastoModule(app) {
  // 1. Instanciamos el repositorio de la base de datos
  const repo = new GastosRepositorySequelize();

  // 2. Inyectamos las dependencias en el controlador
  const controller = new GastosController({
    CrearGastos: new CrearGastos(repo),
    ListarGastos: new ListarGastos(repo),
    ListarPorId: new ListarPorId(repo),
    ActualizarGastos: new ActualizarGastos(repo),
    EliminarGastos: new EliminarGastos(repo),
    ListarPorViatico: new ListarPorViatico(repo),
  });

  // 3. Registramos las rutas en la aplicación Express
  // Usaremos el prefijo /api/gastos
  app.use("/api/gastos", GastosRoutes(controller));
};
