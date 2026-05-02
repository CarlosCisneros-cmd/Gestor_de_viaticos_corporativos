class ListarPorId {
  constructor(IViaticosRepositorio) {
    this.IViaticosRepositorio = IViaticosRepositorio;
  }

  async ejecutar(id) {
    const viatico = await this.IViaticosRepositorio.findById(id);
    
    if (!viatico) {
      const error = new Error("Viatico no encontrado");
      error.statusCode = 404;
      throw error;
    }

    return viatico;
  }
}

module.exports = ListarPorId;