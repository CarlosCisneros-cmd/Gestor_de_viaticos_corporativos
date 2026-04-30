class EliminarUsuario {
  constructor(IUsuarioRepositorio) {
    this.IUsuarioRepositorio = IUsuarioRepositorio;
  }

  async ejecutar(id) {
    const resultado = await this.IUsuarioRepositorio.delete(id);
    
    if (resultado === 0) {
      const error = new Error("No se pudo eliminar: Usuario no encontrado");
      error.statusCode = 404;
      throw error;
    }

    return { message: "Usuario eliminado correctamente", id };
  }
}

module.exports = EliminarUsuario;