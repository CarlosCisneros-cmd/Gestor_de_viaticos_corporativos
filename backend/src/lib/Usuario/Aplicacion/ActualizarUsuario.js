const Usuario = require("../Dominio/Entidades/Usuario");
const { hashPassword } = require("../../Shared/Infrastructure/Security/HashHelper");

class ActualizarUsuario {
  constructor(IUsuarioRepositorio) {
    this.IUsuarioRepositorio = IUsuarioRepositorio;
  }

  async ejecutar(id, data) {
    // 1. Validar que el usuario realmente exista en la base de datos
    const usuarioActual = await this.IUsuarioRepositorio.findById(id);
    if (!usuarioActual) {
      throw new Error("Usuario no encontrado");
    }

    // 2. Validar duplicados de correo
    if (data.correo) {
      const userEmail = await this.IUsuarioRepositorio.findByEmail(data.correo);
      if (userEmail && userEmail.id_Usuario !== parseInt(id)) {
        throw new Error("El correo electrónico ya está siendo usado por otro usuario");
      }
    }

    // 3. Validar duplicados de cédula
    if (data.cedula) {
      const userCedula = await this.IUsuarioRepositorio.findByCedula(data.cedula);
      if (userCedula && userCedula.id_Usuario !== parseInt(id)) {
        throw new Error("La cédula ya está siendo usada por otro usuario");
      }
    }

    // 4. 🔥 FUSIONAR DATOS Y VALIDAR CON LA ENTIDAD DE DOMINIO
    // Esto asegura que si mandan un teléfono o cédula que no cumple los 10-12 caracteres, explote aquí
    const datosFusionados = {
      id_Usuario: usuarioActual.id_Usuario,
      nombre: data.nombre !== undefined ? data.nombre : usuarioActual.nombre,
      correo: data.correo !== undefined ? data.correo : usuarioActual.correo,
      rol: data.rol !== undefined ? data.rol : usuarioActual.rol,
      cedula: data.cedula !== undefined ? data.cedula : usuarioActual.cedula,
      telefono: data.telefono !== undefined ? data.telefono : usuarioActual.telefono,
      id_departamento: data.id_departamento !== undefined ? data.id_departamento : usuarioActual.id_departamento,
      // Si no envían contraseña nueva, mantenemos la de la BD (que ya es un hash)
      contraseña: data.contraseña ? data.contraseña : usuarioActual.contraseña
    };

    // Validamos pasándolo por el constructor de la Entidad de Dominio
    const usuarioValidado = new Usuario(datosFusionados);

    // 5. 🔥 SI CAMBIARON LA CONTRASEÑA, LE APLICAMOS ENCRIPTACIÓN
    if (data.contraseña) {
      usuarioValidado.contraseña = await hashPassword(data.contraseña);
    }

    // 6. Mandar los datos limpios y estructurados al repositorio
    return await this.IUsuarioRepositorio.update(id, usuarioValidado);
  }
}

module.exports = ActualizarUsuario;