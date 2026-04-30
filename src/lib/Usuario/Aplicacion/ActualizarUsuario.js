class ActualizarUsuario {
  constructor(IUsuarioRepositorio) {
    this.IUsuarioRepositorio = IUsuarioRepositorio;
  }

  async ejecutar(id, datosNuevos) {

    if (datosNuevos.correo) {
      const usuarioExistente = await this.IUsuarioRepositorio.findByEmail(datosNuevos.correo);
      
      // Si existe un usuario con ese correo Y no es el mismo que estamos editando
      if (usuarioExistente && usuarioExistente.id_Usuario !== parseInt(id)) {
        const error = new Error("El correo electrónico ya está siendo utilizado por otro usuario.");
        error.statusCode = 400; 
        throw error;
      }
    }

    // 1. Llamamos al método update del repositorio
    const usuarioActualizado = await this.IUsuarioRepositorio.update(id, datosNuevos);

    // 2. Si el repositorio devuelve null, lanzamos un error 404
    if (!usuarioActualizado) {
      const error = new Error("No se pudo actualizar: Usuario no encontrado");
      error.statusCode = 404;
      throw error;
    }

    return usuarioActualizado;
  }
}

module.exports = ActualizarUsuario;