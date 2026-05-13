class ListarViaticos {
  constructor(IViaticosRepositorio) {
    this.IViaticosRepositorio = IViaticosRepositorio;
  }

  async ejecutar() {
    return await this.IViaticosRepositorio.findAll();
  }
}

module.exports = ListarViaticos;