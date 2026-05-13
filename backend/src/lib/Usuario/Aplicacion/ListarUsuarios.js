class ListarUsuarios {
  constructor(IUsuarioRepositorio) {
    this.IUsuarioRepositorio = IUsuarioRepositorio;
  }

  async ejecutar() {
    return await this.IUsuarioRepositorio.findAll();
  }
}

module.exports = ListarUsuarios;