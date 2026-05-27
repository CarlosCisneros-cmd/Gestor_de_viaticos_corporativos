class ObtenerGastoPorUsuario {
  constructor(viaticoRepository) {
    this.viaticoRepository = viaticoRepository;
  }

  async ejecutar(anio, departamento, mes) {
    return await this.viaticoRepository.obtenerGastoPorUsuario(
      anio,
      departamento,
      mes,
    );
  }
}

module.exports = ObtenerGastoPorUsuario;
