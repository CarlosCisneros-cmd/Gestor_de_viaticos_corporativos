class ListarViaticosPorUsuario {
  constructor(viaticoRepository) {
    this.viaticoRepository = viaticoRepository;
  }

  ejecutar(idUsuario) {
    return this.viaticoRepository.listarPorUsuario(idUsuario);
  }
}

module.exports = ListarViaticosPorUsuario;
