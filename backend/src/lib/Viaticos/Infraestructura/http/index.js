const ViaticoRoutes = require("./ViaticoRoutes");
const ViaticoController = require("./ViaticoController");

// Repositorio de Sequelize para Viáticos
const ViaticoRepositorySequelize = require("../ViaticoRepositorioSequelize");

const CrearViatico = require("../../Aplicacion/CrearViatico");
const ActualizarViatico = require("../../Aplicacion/ActualizarViatico");
const ListarViaticos = require("../../Aplicacion/ListarViaticos");
const ListarPorId = require("../../Aplicacion/ListarPorId");
const EliminarViatico = require("../../Aplicacion/EliminarViatico");

module.exports = function registerViaticoModule(app) {
  const repo = new ViaticoRepositorySequelize();

  const controller = new ViaticoController({
    CrearViatico: new CrearViatico(repo),
    ActualizarViatico: new ActualizarViatico(repo),
    ListarViaticos: new ListarViaticos(repo),
    ListarPorId: new ListarPorId(repo),
    EliminarViatico: new EliminarViatico(repo),
  });

  app.use("/api/viaticos", ViaticoRoutes(controller));
};