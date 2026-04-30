const DepartamentosRoutes = require("./DepartamentosRoutes");
const DepartamentosController = require("./DepartamentosController");

// Adaptador de base de datos
const DepartamentosRepositorySequelize = require("../DepartamentosRepositorySequelize");

// Casos de Uso (Aplicación)
const CrearDepartamento = require("../../Aplicacion/CrearDepartamento");
const ListarDepartamentos = require("../../Aplicacion/ListarDepartamentos");

module.exports = function registerDepartamentosModule(app) {
  // 1. Instanciamos el repositorio (Adaptador de Infraestructura)
  const repo = new DepartamentosRepositorySequelize();

  // 2. Instanciamos los casos de uso inyectando el repositorio
  const crearDepartamento = new CrearDepartamento(repo);
  const listarDepartamentos = new ListarDepartamentos(repo);

  // 3. Inyectamos los casos de uso en el controlador
  const controller = new DepartamentosController({
    crearDepartamento,
    listarDepartamentos,
    // Si luego creas los casos de uso de eliminar/obtener, los inyectas aquí
  });

  // 4. Registramos las rutas en la aplicación Express
  app.use("/api/departamentos", DepartamentosRoutes(controller));
};