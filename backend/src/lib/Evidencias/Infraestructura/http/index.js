const EvidenciasRoutes = require("./EvidenciasRoutes");
const EvidenciasController = require("./EvidenciasController");

const EvidenciasRepositoryMongoose = require("../EvidenciasRepositoryMongoose");

const CrearEvidencias = require("../../Aplicacion/CrearEvidencias");
const ListarEvidenciasPorGastos = require("../../Aplicacion/ListarEvidenciasPorGastos");
const EliminarEvidencias = require("../../Aplicacion/EliminarEvidencias");

module.exports = function registerEvidenciasModule(app) {
  const repo = new EvidenciasRepositoryMongoose();

  const controller = new EvidenciasController({
    crearEvidencias: new CrearEvidencias(repo),
    listarEvidenciasPorGastos: new ListarEvidenciasPorGastos(repo),
    eliminarEvidencias: new EliminarEvidencias(repo),
  });

  app.use("/api/evidencias", EvidenciasRoutes(controller));
};