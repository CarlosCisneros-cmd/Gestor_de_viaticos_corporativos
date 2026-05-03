class ListarEvidenciasPorGasto {
  constructor(IEvidenciasRepositorio) {
    this.IEvidenciasRepositorio = IEvidenciasRepositorio;
  }

  async ejecutar(id_gasto) {
    // Validamos que nos pasen un ID
    if (!id_gasto) {
      const error = new Error("El ID del gasto es obligatorio para listar las evidencias");
      error.statusCode = 400;
      throw error;
    }

    const evidencias = await this.IEvidenciasRepositorio.findByGastoId(id_gasto);
    
    return evidencias;
  }
}

module.exports = ListarEvidenciasPorGasto;