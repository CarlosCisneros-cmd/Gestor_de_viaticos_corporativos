class ListarPorId {
  constructor(IUsuarioRepositorio) {
    this.IUsuarioRepositorio = IUsuarioRepositorio;
  }

  async ejecutar(id) {
    const usuario = await this.IUsuarioRepositorio.findById(id);
    
    if (!usuario) {
      const error = new Error("Usuario no encontrado");
      error.statusCode = 404;
      throw error;
    }

    return usuario;
  }
}

module.exports = ListarPorId;