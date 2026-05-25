class ActualizarUsuario {
  constructor(IUsuarioRepositorio) {
    this.IUsuarioRepositorio = IUsuarioRepositorio;
  }

  async ejecutar(id, data) {
    // 1. Si se intenta actualizar el correo, validar que no pertenezca a otro usuario
    if (data.correo) {
      const userEmail = await this.IUsuarioRepositorio.findByEmail(data.correo);
      if (userEmail && userEmail.id_Usuario !== parseInt(id)) {
        throw new Error("El correo electrónico ya está siendo usado por otro usuario");
      }
    }

    // 2. Si se intenta actualizar la cédula, validar que no pertenezca a otro usuario
    if (data.cedula) {
      const userCedula = await this.IUsuarioRepositorio.findByCedula(data.cedula);
      if (userCedula && userCedula.id_Usuario !== parseInt(id)) {
        throw new Error("La cédula ya está siendo usada por otro usuario");
      }
    }

    return await this.IUsuarioRepositorio.update(id, data);
  }
}

module.exports = ActualizarUsuario;