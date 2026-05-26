class ObtenerGastoMensual {
  constructor(viaticoRepository) {
    this.viaticoRepository = viaticoRepository;
  }

  async ejecutar(anio) {
    return await this.viaticoRepository.obtenerGastoMensualPorAnio(anio);
  }
}

module.exports = ObtenerGastoMensual;
