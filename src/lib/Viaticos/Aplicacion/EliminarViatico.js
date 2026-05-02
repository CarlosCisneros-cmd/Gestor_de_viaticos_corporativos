class EliminarViatico {
  constructor(IViaticosRepositorio) {
    this.IViaticosRepositorio = IViaticosRepositorio;
  }

  async ejecutar(id) {
    // El repositorio devolverá el número de filas afectadas
    const resultado = await this.IViaticosRepositorio.delete(id);
    
    // Si el resultado es 0, significa que no se encontró el ID en Postgres
    if (resultado === 0) {
      const error = new Error("No se pudo eliminar: Viatico no encontrado");
      error.statusCode = 404;
      throw error;
    }

    // Retornamos el mismo formato de éxito que Usuarios
    return { message: "Viatico eliminado correctamente", id };
  }
}

module.exports = EliminarViatico;