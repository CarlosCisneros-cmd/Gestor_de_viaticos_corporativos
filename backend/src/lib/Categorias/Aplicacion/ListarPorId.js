class ListarPorId {
  constructor(ICategoriaRepositorio) {
    this.ICategoriaRepositorio = ICategoriaRepositorio;
  }

  async ejecutar(id) {
    const categoria = await this.ICategoriaRepositorio.findById(id);

    if (!categoria) {
      const error = new Error("Categoría no encontrada");
      error.statusCode = 404;
      throw error;
    }

    return categoria;
  }
}

module.exports = ListarPorId;