class ObtenerGastoPorDepartamento {
  constructor(viaticoRepository) {
    this.viaticoRepository = viaticoRepository;
  }

  async ejecutar(anio) {
    return await this.viaticoRepository.obtenerGastoPorDepartamento(anio);
  }
}

module.exports = ObtenerGastoPorDepartamento;
