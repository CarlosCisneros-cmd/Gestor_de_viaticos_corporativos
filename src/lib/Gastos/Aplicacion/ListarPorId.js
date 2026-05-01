class ListarPorId {
  constructor(IGastosRepositorio) {
    this.IGastosRepositorio = IGastosRepositorio;
  }

  async ejecutar(id) {
    const gasto = await this.IGastosRepositorio.findById(id);
    
    // Lanzamos el error tal cual se maneja en el proyecto para que el controlador lo atrape
    if (!gasto) {
      throw new Error("Gasto no encontrado");
    }
    
    return gasto;
  }
}

module.exports = ListarPorId;