// La entidad de dominio es la misma para ambos proyectos
const Usuario = require("../Dominio/Entidades/Usuario");

class CrearUsuario {
  constructor(IUsuarioRepositorio) {
    // Aquí inyectamos la implementación (Sequelize o Mongoose)
    this.IUsuarioRepositorio = IUsuarioRepositorio;
  }

  async ejecutar(data) {
    // 1. Instanciamos la entidad de dominio para validar los datos
    // (Tu clase Usuario ya tiene los "if (!nombre) throw Error...")
    const usuarioEntidad = new Usuario(data); 

    // 2. Enviamos la entidad validada al repositorio
    // No importa si save() usa .create() de Sequelize o .save() de Mongoose
    return await this.IUsuarioRepositorio.save(usuarioEntidad);
  }
}

module.exports = CrearUsuario;

