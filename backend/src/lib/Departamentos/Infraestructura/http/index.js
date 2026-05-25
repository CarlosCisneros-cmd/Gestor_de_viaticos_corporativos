const DepartamentosRoutes = require("./DepartamentosRoutes");
const DepartamentosController = require("./DepartamentosController");
const DepartamentosRepositorySequelize = require("../DepartamentosRepositorySequelize");

// Casos de Uso (Aplicación)
const CrearDepartamento = require("../../Aplicacion/CrearDepartamento");
const ListarDepartamentos = require("../../Aplicacion/ListarDepartamentos");
const ObtenerDepartamentoPorId = require("../../Aplicacion/ObtenerDepartamentoPorId"); // 
const ActualizarDepartamento = require("../../Aplicacion/ActualizarDepartamento");     // 
const EliminarDepartamento = require("../../Aplicacion/EliminarDepartamento");         // 

module.exports = function registerDepartamentosModule(app) {
  // 1. Instanciamos el repositorio
  const repo = new DepartamentosRepositorySequelize();

  // 2. Instanciamos los casos de uso inyectando el repositorio
  const crearDepartamento = new CrearDepartamento(repo);
  const listarDepartamentos = new ListarDepartamentos(repo);
  const obtenerDepartamentoPorId = new ObtenerDepartamentoPorId(repo); // 
  const actualizarDepartamento = new ActualizarDepartamento(repo);     // 
  const eliminarDepartamento = new EliminarDepartamento(repo);         // 

  // 3. Inyectamos TODOS los casos de uso en el controlador
  const controller = new DepartamentosController({
    crearDepartamento,
    listarDepartamentos,
    obtenerDepartamentoPorId, // 
    actualizarDepartamento,   // 
    eliminarDepartamento,     // 
  });

  // 4. Registramos las rutas en la aplicación Express
  app.use("/api/departamentos", DepartamentosRoutes(controller));
};