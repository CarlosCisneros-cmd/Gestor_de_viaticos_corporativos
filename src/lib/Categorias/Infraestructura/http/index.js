const CategoriaRoutes = require("./CategoriaRoutes");
const CategoriaController = require("./CategoriaController");
const CategoriaRepositorySequelize = require("../CategoriaRepositorySequelize");

// Importamos los Casos de Uso
const CrearCategoria = require("../../Aplicacion/CrearCategoria");
const ListarCategoria = require("../../Aplicacion/ListarCategoria");
const ListarPorId = require("../../Aplicacion/ListarPorId");
const ActualizarCategoria = require("../../Aplicacion/ActualizarCategoria");
const EliminarCategoria = require("../../Aplicacion/EliminarCategoria");

module.exports = function registerCategoriaModule(app) {
  const repo = new CategoriaRepositorySequelize();

  const controller = new CategoriaController({
    CrearCategoria: new CrearCategoria(repo),
    ListarCategoria: new ListarCategoria(repo),
    ListarPorId: new ListarPorId(repo),
    ActualizarCategoria: new ActualizarCategoria(repo),
    EliminarCategoria: new EliminarCategoria(repo),
  });

  // Registramos en el prefijo /api/categorias
  app.use("/api/categorias", CategoriaRoutes(controller));
};