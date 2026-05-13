class ListarDepartamentos {
  constructor(IDepartamentosRepositorio) {
    this.IDepartamentosRepositorio = IDepartamentosRepositorio;
  }

  async ejecutar() {
    // Simplemente pedimos al repositorio todos los registros
    return await this.IDepartamentosRepositorio.findAll();
  }
}

module.exports = ListarDepartamentos;