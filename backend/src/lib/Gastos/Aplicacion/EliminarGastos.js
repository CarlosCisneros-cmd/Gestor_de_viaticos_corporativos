class EliminarGastos {
  constructor(IGastosRepositorio) {
    this.IGastosRepositorio = IGastosRepositorio;
  }

  async ejecutar(id) {
    // El repositorio devolverá el número de filas afectadas
    const resultado = await this.IGastosRepositorio.delete(id);
    
    // Si el resultado es 0, significa que no se encontró el ID en Postgres
    if (resultado === 0) {
      const error = new Error("No se pudo eliminar: Gasto no encontrado");
      error.statusCode = 404;
      throw error;
    }

    // Retornamos el mismo formato de éxito que Usuarios
    return { message: "Gasto eliminado correctamente", id };
  }
}

module.exports = EliminarGastos;