const UsuarioRoutes = require("./UsuarioRoutes");
const UsuarioController = require("./UsuarioController");

// Cambiamos el repositorio de Mongoose por el de Sequelize
const UsuarioRepositorySequelize = require("../UsuarioRepositorySequelize");

// Los Casos de Uso se mantienen igual (Arquitectura Hexagonal)
const CrearUsuario = require("../../Aplicacion/CrearUsuario");
const ListarUsuario = require("../../Aplicacion/ListarUsuario");
const ListarPorId = require("../../Aplicacion/ListarPorId");


module.exports = function registerUserModule(app) {
  // 1. Instanciamos el repositorio de la base de datos relacional
  const repo = new UsuarioRepositorySequelize();

  // 2. Inyectamos las dependencias en el controlador
  // Cada caso de uso recibe el repositorio de Sequelize
  const controller = new UsuarioController({
    crearUsuario: new CrearUsuario(repo),
    //listarUsuario: new ListarUsuario(repo),
    //ListarPorId: new ListarPorId(repo),
  });

  // 3. Registramos las rutas en la aplicación Express
  app.use("/api/usuarios", UsuarioRoutes(controller));
};