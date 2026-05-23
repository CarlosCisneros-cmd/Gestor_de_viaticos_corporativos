const UsuarioRoutes = require("./UsuarioRoutes");
const UsuarioController = require("./UsuarioController");

// Cambiamos el repositorio de Sequelize
const UsuarioRepositorySequelize = require("../UsuarioRepositorySequelize");

// Los Casos de Uso se mantienen igual (Arquitectura Hexagonal)
const CrearUsuario = require("../../Aplicacion/CrearUsuario");
const ActualizarUsuario = require("../../Aplicacion/ActualizarUsuario");
const ListarUsuarios = require("../../Aplicacion/ListarUsuarios");
const ListarPorId = require("../../Aplicacion/ListarPorId");
const EliminarUsuario = require("../../Aplicacion/EliminarUsuario");
// 👇 NUEVO CASO DE USO IMPORTADO
const LoginUsuario = require("../../Aplicacion/LoginUsuario"); 

module.exports = function registerUserModule(app) {
  // 1. Instanciamos el repositorio de la base de datos relacional
  const repo = new UsuarioRepositorySequelize();

  // 2. Inyectamos las dependencias en el controlador
  const controller = new UsuarioController({
    CrearUsuario: new CrearUsuario(repo),
    ActualizarUsuario: new ActualizarUsuario(repo),
    ListarUsuarios: new ListarUsuarios(repo),
    ListarPorId: new ListarPorId(repo),
    EliminarUsuario: new EliminarUsuario(repo),
    LoginUsuario: new LoginUsuario(repo), // 👇 INYECTADO AQUÍ
  });

  // 3. Registramos las rutas en la aplicación Express
  app.use("/api/usuarios", UsuarioRoutes(controller));
};