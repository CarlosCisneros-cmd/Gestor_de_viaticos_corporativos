class EliminarCategoria {
  constructor(ICategoriaRepositorio) {
    this.ICategoriaRepositorio = ICategoriaRepositorio;
  }

  async ejecutar(id) {
    // El repositorio devolverá el número de filas afectadas (0 o 1)
    const resultado = await this.ICategoriaRepositorio.delete(id);
    
    if (resultado === 0) {
      const error = new Error("No se pudo eliminar: Categoría no encontrada");
      error.statusCode = 404;
      throw error;
    }

    // Mantenemos el formato de respuesta de éxito de Usuarios
    return { message: "Categoría eliminada correctamente", id };
  }
}

module.exports = EliminarCategoria;