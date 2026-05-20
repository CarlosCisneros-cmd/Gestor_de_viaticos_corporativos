class ListarPorViatico {
  constructor(repository) {
    this.repository = repository;
  }

  async ejecutar(viaticoId) {
    return await this.repository.findByViatico(viaticoId);
  }
}

module.exports = ListarPorViatico;
