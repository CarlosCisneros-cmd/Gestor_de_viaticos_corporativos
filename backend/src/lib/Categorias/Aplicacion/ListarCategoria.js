class ListarCategoria {
  constructor(ICategoriaRepositorio) {
    this.ICategoriaRepositorio = ICategoriaRepositorio;
  }

  async ejecutar() {
    return await this.ICategoriaRepositorio.findAll();
  }
}

module.exports = ListarCategoria;