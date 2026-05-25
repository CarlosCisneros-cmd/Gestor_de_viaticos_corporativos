const Usuario = require("../Dominio/Entidades/Usuario");
const { hashPassword } = require("../../Shared/Infrastructure/Security/HashHelper");

class CrearUsuario {
  constructor(IUsuarioRepositorio) {
    this.IUsuarioRepositorio = IUsuarioRepositorio;
  }

  async ejecutar(data) {
    // 1. Validar duplicados en la Base de Datos
    const emailExistente = await this.IUsuarioRepositorio.findByEmail(data.correo);
    if (emailExistente) throw new Error("El correo ya está registrado");

    const cedulaExistente = await this.IUsuarioRepositorio.findByCedula(data.cedula);
    if (cedulaExistente) throw new Error("La cédula ya está registrada");

    // 2. 🔥 PRIMERO creamos la entidad (Valida los datos limpios de Postman: cédula de 10, etc.)
    const usuarioEntidad = new Usuario(data);

    // 3. 🔥 DESPUÉS encriptamos la contraseña y se la asignamos a la entidad armada
    usuarioEntidad.contraseña = await hashPassword(usuarioEntidad.contraseña);

    // 4. Guardar la entidad protegida en la BD
    return await this.IUsuarioRepositorio.save(usuarioEntidad);
  }
}
module.exports = CrearUsuario;
