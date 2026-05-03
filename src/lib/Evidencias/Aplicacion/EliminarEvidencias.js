class EliminarEvidencias {
  constructor(IEvidenciasRepositorio) {
    this.IEvidenciasRepositorio = IEvidenciasRepositorio;
  }

  async ejecutar(id) {
    const resultado = await this.IEvidenciasRepositorio.delete(id);

    if (!resultado) {
      const error = new Error("No se pudo eliminar: Evidencia no encontrada");
      error.statusCode = 404;
      throw error;
    }

    return { message: "Evidencia de gasto eliminada correctamente", id };
  }
}

module.exports = EliminarEvidencias;