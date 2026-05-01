class ActualizarCategoria {
  constructor(ICategoriaRepositorio) {
    this.ICategoriaRepositorio = ICategoriaRepositorio;
  }

  async ejecutar(id, datosNuevos) {
    // 1. Llamamos al método update del repositorio
    const categoriaActualizada = await this.ICategoriaRepositorio.update(id, datosNuevos);

    // 2. Si el repositorio devuelve null, lanzamos un error 404 con statusCode
    if (!categoriaActualizada) {
      const error = new Error("No se pudo actualizar: Categoría no encontrada");
      error.statusCode = 404;
      throw error;
    }

    return categoriaActualizada;
  }
}

module.exports = ActualizarCategoria;