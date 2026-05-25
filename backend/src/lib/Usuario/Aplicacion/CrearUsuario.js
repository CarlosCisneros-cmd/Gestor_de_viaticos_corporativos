const Usuario = require("../Dominio/Entidades/Usuario");
const { hashPassword } = require("../../Shared/Infrastructure/Security/HashHelper");

class CrearUsuario {
  constructor(IUsuarioRepositorio) {
    this.IUsuarioRepositorio = IUsuarioRepositorio;
  }

  async ejecutar(data) {
    // 1. Validar duplicados
    const emailExistente = await this.IUsuarioRepositorio.findByEmail(data.correo);
    if (emailExistente) throw new Error("El correo ya está registrado");

    const cedulaExistente = await this.IUsuarioRepositorio.findByCedula(data.cedula);
    if (cedulaExistente) throw new Error("La cédula ya está registrada");

    // 2. Hash de contraseña antes de crear la entidad
    data.contraseña = await hashPassword(data.contraseña);

    // 3. Crear entidad y guardar
    const usuarioEntidad = new Usuario(data);
    return await this.IUsuarioRepositorio.save(usuarioEntidad);
  }
}
module.exports = CrearUsuario;

